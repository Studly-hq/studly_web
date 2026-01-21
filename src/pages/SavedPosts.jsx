import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bookmark, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFeed } from "../context/FeedContext";
import PostCard from "../components/post/PostCard";
import { FeedSkeleton } from "../components/common/Skeleton";

const SavedPosts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { bookmarkedPosts, fetchBookmarks, isBookmarksLoading, updatePostInState, deletePostFromState } = useFeed();

  // Track if we've already fetched bookmarks
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchBookmarks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-reddit-bg pt-20 px-4">
        <div className="max-w-[640px] mx-auto text-center py-16">
          <div className="p-4">
            <Bookmark
              size={48}
              className="text-reddit-textMuted mx-auto mb-4 opacity-50"
            />
            <h2 className="text-xl font-bold text-reddit-text mb-2">
              Login to View Saved Posts
            </h2>
            <p className="text-reddit-textMuted text-sm">
              Sign in to access your bookmarked study materials
            </p>
          </div>
        </div>
      </div>
    );
  }

  const savedPosts = bookmarkedPosts;

  return (
    <div className="min-h-screen bg-reddit-bg pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
        <div className="max-w-[640px] mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 hover:bg-reddit-cardHover rounded transition-colors"
            >
              <ArrowLeft size={18} className="text-reddit-text" />
            </motion.button>
            <div className="flex items-center gap-2">
              <Bookmark size={18} className="text-reddit-orange" />
              <div>
                <h1 className="text-base font-bold text-reddit-text">
                  Saved Posts
                </h1>
                <p className="text-xs text-reddit-textMuted">
                  {savedPosts.length}{" "}
                  {savedPosts.length === 1 ? "post" : "posts"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[640px] mx-auto px-4 py-5">
        {isBookmarksLoading ? (
          <FeedSkeleton count={3} />
        ) : savedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-reddit-card rounded-md p-10 border border-reddit-border">
              <Bookmark
                size={40}
                className="text-reddit-textMuted mx-auto mb-3 opacity-50"
              />
              <h3 className="text-lg font-bold text-reddit-text mb-2">
                No Saved Posts Yet
              </h3>
              <p className="text-reddit-textMuted text-sm mb-6">
                Start bookmarking posts to build your study collection
              </p>
              <motion.button
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 bg-reddit-orange hover:bg-reddit-orange/90 text-white text-sm rounded font-medium transition-colors"
              >
                Explore Feed
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {savedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <PostCard
                  post={post}
                  onPostUpdated={updatePostInState}
                  onPostDeleted={deletePostFromState}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
