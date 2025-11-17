import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
 
  Link as LinkIcon,
  Edit3,
  Flame,
  Trophy,

  UserPlus,
  BookOpen
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudyGram } from '../context/StudyGramContext';
import PostCard from '../components/post/PostCard';
import { getUserById } from '../data/studygramData';

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { currentUser, isAuthenticated, posts } = useStudyGram();
  const [activeTab, setActiveTab] = useState('posts');

  // Get the profile user (either from URL param or current user)
  const profileUser = userId ? getUserById(userId) : currentUser;
  const isOwnProfile = isAuthenticated && profileUser?.id === currentUser?.id;

  // Get user's posts (posts already have user data attached)
  const userPosts = posts.filter(post => post.userId === profileUser?.id);

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-gray-400">This user doesn't exist</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'posts', label: 'Posts', count: userPosts.length },
    { id: 'saved', label: 'Saved', count: profileUser.savedPosts?.length || 0, hideIfNotOwn: true }
  ];

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-white">{profileUser.displayName}</h1>
              <p className="text-sm text-gray-400">{userPosts.length} posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 mb-6"
        >
          {/* Profile Image & Basic Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profileUser.avatar}
                  alt={profileUser.displayName}
                  className="w-24 h-24 rounded-full border-4 border-blue-600"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                  <Trophy size={16} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profileUser.displayName}
                </h2>
                <p className="text-gray-400 mb-2">@{profileUser.username}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Flame size={16} className="text-orange-500" />
                    <span className="text-white font-semibold">{profileUser.streak}</span>
                    <span className="text-gray-400">day streak</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Trophy size={16} className="text-blue-600" />
                    <span className="text-white font-semibold">{profileUser.auraPoints}</span>
                    <span className="text-gray-400">aura</span>
                  </div>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <motion.button
                onClick={() => navigate('/profile/edit')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Edit3 size={16} />
                Edit
              </motion.button>
            )}
            {!isOwnProfile && isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <UserPlus size={16} />
                Follow
              </motion.button>
            )}
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <p className="text-white mb-4">{profileUser.bio}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Joined {new Date(profileUser.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Following Stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-800">
            <button className="hover:underline">
              <span className="text-white font-bold">{profileUser.following}</span>
              <span className="text-gray-400 ml-1">Following</span>
            </button>
            <button className="hover:underline">
              <span className="text-white font-bold">{profileUser.followers}</span>
              <span className="text-gray-400 ml-1">Followers</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-gray-900/50 rounded-lg p-1 border border-gray-800">
          {tabs.map(tab => {
            if (tab.hideIfNotOwn && !isOwnProfile) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'posts' && (
            <>
              {userPosts.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
                  <BookOpen size={48} className="text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Posts Yet
                  </h3>
                  <p className="text-gray-400">
                    {isOwnProfile ? "Start sharing your study journey!" : "This user hasn't posted yet"}
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
                    <PostCard post={post} />
                  </motion.div>
                ))
              )}
            </>
          )}

          {activeTab === 'saved' && isOwnProfile && (
            <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
              <BookOpen size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Saved Posts
              </h3>
              <p className="text-gray-400 mb-6">
                Posts you bookmark will appear here
              </p>
              <motion.button
                onClick={() => navigate('/saved')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Go to Saved Posts
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
