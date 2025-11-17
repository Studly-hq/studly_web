import { motion } from 'framer-motion';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyGram } from '../context/StudyGramContext';
import PostCard from '../components/post/PostCard';

const SavedPosts = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, posts } = useStudyGram();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <Bookmark size={64} className="text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Login to View Saved Posts
          </h2>
          <p className="text-gray-400">
            Sign in to access your bookmarked study materials
          </p>
        </div>
      </div>
    );
  }

  // Get saved posts from bookmarkedBy field (posts already have user data attached)
  const savedPosts = posts.filter(post =>
    post.bookmarkedBy?.includes(currentUser?.id)
  );

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
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <Bookmark size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Saved Posts</h1>
                <p className="text-sm text-gray-400">
                  {savedPosts.length} {savedPosts.length === 1 ? 'post' : 'posts'} saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {savedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-gray-900/50 rounded-2xl p-12 border border-gray-800">
              <Bookmark size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Saved Posts Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start bookmarking posts to build your study collection
              </p>
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Explore Feed
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
