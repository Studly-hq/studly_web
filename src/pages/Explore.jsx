import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyGram } from '../context/StudyGramContext';
import PostCard from '../components/post/PostCard';

const Explore = () => {
  const navigate = useNavigate();
  const { posts } = useStudyGram();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Extract all unique tags from posts
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

  // Get trending tags (tags with most posts)
  const tagCounts = {};
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const trendingTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Filter posts based on search query or selected tag
  const filteredPosts = posts.filter(post => {
    if (selectedTag) {
      return post.tags?.includes(selectedTag);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.content.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-white mb-4">Explore</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, tags, topics..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Posts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Active Filters */}
            {(selectedTag || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-400 text-sm">Active filters:</span>
                  {selectedTag && (
                    <span className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-400 text-sm font-medium">
                      #{selectedTag}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-400 text-sm font-medium">
                      "{searchQuery}"
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear all
                </motion.button>
              </motion.div>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800"
                >
                  <Search size={48} className="text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search or filters
                  </p>
                  {(selectedTag || searchQuery) && (
                    <motion.button
                      onClick={clearFilters}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <>
                  <p className="text-sm text-gray-400 px-4">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                  </p>
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Trending Tags */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-white">Trending Tags</h2>
                </div>

                <div className="space-y-2">
                  {trendingTags.map(({ tag, count }, index) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Hash size={16} />
                        <span className="font-medium">{tag}</span>
                      </div>
                      <span className={`text-sm ${
                        selectedTag === tag ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {count} {count === 1 ? 'post' : 'posts'}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {allTags.length > 10 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Show more tags
                  </motion.button>
                )}
              </motion.div>

              {/* Popular Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
              >
                <h2 className="text-lg font-bold text-white mb-4">Popular Topics</h2>
                <div className="space-y-3">
                  {['Computer Science', 'Mathematics', 'Physics', 'Web Development', 'Study Tips'].map((topic, index) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">{topic}</span>
                      <span className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10}k posts</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
