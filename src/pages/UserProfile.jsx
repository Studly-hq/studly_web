import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Edit3,
  Flame,
  Trophy,
  BookOpen,
  User,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PostCard from "../components/post/PostCard";
import { useAuth } from "../context/AuthContext";
import { useFeed } from "../context/FeedContext";
import { useUI } from "../context/UIContext";
import {
  getProfileByUsername,
  getUserStreak,
  getUserAuraPoints,
} from "../api/profile";

const UserProfileContent = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const {
    currentUser,
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const {
    fetchUserPosts,
    bookmarkedPosts,
    fetchBookmarks,
    updatePostInState,
    deletePostFromState,
  } = useFeed();

  const { setShowAuthModal } = useUI();

  const [activeTab, setActiveTab] = useState("posts");
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);

  // Determine if we're viewing our own profile or someone else's
  const isOwnProfile =
    !username || (isAuthenticated && currentUser?.username === username);

  useEffect(() => {
    const fetchProfile = async () => {
      // If we are still checking auth and no username param is present (trying to view own profile),
      // we must wait.
      if (isAuthLoading && !username) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (username) {
          // Viewing another user's profile by username
          const data = await getProfileByUsername(username);

          // Parallelize fetches for better performance
          const [initialPosts, streakData, auraPointsData] = await Promise.all([
            fetchUserPosts(username),
            getUserStreak(username),
            getUserAuraPoints(username),
          ]);

          setProfileUser({
            ...data,
            streak: streakData,
            auraPoints: auraPointsData,
          });
          setUserPosts(initialPosts);
        } else {
          // Viewing own profile (no username param)
          if (currentUser) {
            // Refresh stats
            const [streakData, auraPointsData, initialPosts] =
              await Promise.all([
                getUserStreak(currentUser.username),
                getUserAuraPoints(currentUser.username),
                fetchUserPosts(currentUser.username),
              ]);

            setProfileUser({
              ...currentUser,
              streak: streakData,
              auraPoints: auraPointsData,
            });
            setUserPosts(initialPosts);
          } else {
            setProfileUser(null);
            // Non-authenticated user trying to view '/profile'
            if (!isAuthenticated) {
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("User not found");
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser, fetchUserPosts, isAuthLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, fetchBookmarks]);

  // Use bookmarkedPosts from context for the Saved tab
  const savedPosts = bookmarkedPosts;

  if (loading) {
    return (
      <div className="min-h-screen bg-reddit-bg pt-20 px-4 flex items-center justify-center">
        <LoadingSpinner size={40} color="#FF4500" />
      </div>
    );
  }

  // Handle guest state for /profile (no username)
  if (!isAuthenticated && !username) {
    return (
      <div className="min-h-screen bg-reddit-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-reddit-cardHover/5 border border-dashed border-reddit-border rounded-3xl p-12 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-reddit-orange/10 flex items-center justify-center">
            <User size={40} className="text-reddit-orange" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-reddit-text mb-2">Join Studly</h2>
            <p className="text-reddit-textMuted">Log in to view your profile and track your study journey!</p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold py-3 rounded-full transition-all"
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (error || (!profileUser && username)) {
    return (
      <div className="min-h-screen bg-reddit-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-20">
          <h2 className="text-2xl font-bold text-reddit-text mb-2">
            User Not Found
          </h2>
          <p className="text-reddit-textMuted">The user @{username} doesn't exist</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 text-reddit-orange hover:underline font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-reddit-bg pt-20 px-4 flex items-center justify-center">
        <LoadingSpinner size={40} color="#FF4500" />
      </div>
    );
  }

  const handlePostUpdated = (postId, newContent) => {
    setUserPosts(prev => prev.map(p => String(p.id) === String(postId) ? { ...p, content: newContent } : p));
    updatePostInState(postId, newContent);
  };

  const handlePostDeleted = (postId) => {
    setUserPosts(prev => prev.filter(p => String(p.id) !== String(postId)));
    deletePostFromState(postId);
  };

  const tabs = [
    { id: "posts", label: "Posts", count: userPosts.length },
    {
      id: "saved",
      label: "Saved",
      count: savedPosts.length,
      hideIfNotOwn: true,
    },
  ];

  return (
    <div className="min-h-screen bg-reddit-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-reddit-cardHover rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-reddit-text" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-reddit-text">
                {profileUser.displayName}
              </h1>
              <p className="text-sm text-reddit-textMuted">
                {userPosts.length} posts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6 mb-6"
        >
          {/* Profile Image & Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
              <div className="relative">
                {profileUser.avatar ? (
                  <img
                    src={profileUser.avatar}
                    alt={profileUser.displayName}
                    className="w-20 md:w-24 h-20 md:h-24 rounded-full border-3 md:border-4 border-reddit-orange object-cover"
                  />
                ) : (
                  <div className="w-20 md:w-24 h-20 md:h-24 rounded-full border-3 md:border-4 border-reddit-orange bg-reddit-cardHover flex items-center justify-center">
                    <User
                      size={32}
                      className="text-reddit-textMuted md:w-10 md:h-10"
                    />
                  </div>
                )}
                <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-reddit-orange rounded-full p-1.5 md:p-2">
                  <Trophy size={14} className="text-white md:w-4 md:h-4" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-reddit-text mb-1 capitalize">
                  {profileUser.displayName}
                </h2>
                <p className="text-sm md:text-base text-reddit-textMuted mb-2">
                  @{profileUser.username}
                </p>

                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <div className="flex items-center gap-1 text-xs md:text-sm">
                    <Flame
                      size={14}
                      className="text-reddit-orange md:w-4 md:h-4"
                    />
                    <span className="text-reddit-text font-semibold">
                      {profileUser.streak}
                    </span>
                    <span className="text-reddit-textMuted">day streak</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs md:text-sm">
                    <Trophy
                      size={14}
                      className="text-reddit-orange md:w-4 md:h-4"
                    />
                    <span className="text-reddit-text font-semibold">
                      {profileUser.auraPoints}
                    </span>
                    <span className="text-reddit-textMuted">aura</span>
                  </div>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <motion.button
                onClick={() => navigate("/profile/edit")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 md:px-4 py-2 bg-reddit-cardHover hover:bg-reddit-border text-reddit-text rounded text-sm md:text-base font-semibold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
              >
                <Edit3 size={16} />
                Edit
              </motion.button>
            )}
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <p className="text-reddit-text mb-4">{profileUser.bio}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-reddit-textMuted mb-4 md:mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="md:w-4 md:h-4" />
              <span>
                Joined{" "}
                {new Date(profileUser.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>


        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-reddit-card rounded p-1 border border-reddit-border">
          {tabs.map((tab) => {
            if (tab.hideIfNotOwn && !isOwnProfile) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 md:px-4 py-2 md:py-3 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === tab.id
                  ? "bg-reddit-orange text-white"
                  : "text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-cardHover"
                  } `}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "posts" && (
            <>
              {userPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <BookOpen
                    size={48}
                    className="text-reddit-textMuted mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-xl font-bold text-reddit-text mb-2">
                    No Posts Yet
                  </h3>
                  <p className="text-reddit-textMuted">
                    {isOwnProfile
                      ? "Start sharing your study journey!"
                      : "This user hasn't posted yet"}
                  </p>
                </div>
              ) : (
                userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      post={post}
                      onPostUpdated={handlePostUpdated}
                      onPostDeleted={handlePostDeleted}
                    />
                  </motion.div>
                ))
              )}
            </>
          )}

          {activeTab === "saved" && isOwnProfile && (
            <>
              {savedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <BookOpen
                    size={48}
                    className="text-reddit-textMuted mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-xl font-bold text-reddit-text mb-2">
                    No Saved Posts
                  </h3>
                  <p className="text-reddit-textMuted">
                    Posts you bookmark will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-2">
                  {savedPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PostCard
                        post={post}
                        onPostUpdated={handlePostUpdated}
                        onPostDeleted={handlePostDeleted}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const location = useLocation();
  return <UserProfileContent key={location.pathname} />;
};

export default UserProfile;
