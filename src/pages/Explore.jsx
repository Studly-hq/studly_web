import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, X, Flame, Sparkles, Clock } from 'lucide-react';
import { useStudyGram } from '../context/StudyGramContext';
import PostCard from '../components/post/PostCard';

const Explore = () => {
  const { posts } = useStudyGram();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('trending'); // trending, recent, top

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
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  // Filter and sort posts
  let filteredPosts = posts.filter(post => {
    if (selectedTag) {
      return post.tags?.includes(selectedTag);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.content.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        post.user.username.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Apply sorting
  if (sortBy === 'trending') {
    filteredPosts = filteredPosts.sort((a, b) => b.likeCount - a.likeCount);
  } else if (sortBy === 'recent') {
    filteredPosts = filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortBy === 'top') {
    filteredPosts = filteredPosts.sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount));
  }

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  const quickFilters = [
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'top', label: 'Top', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-reddit-bg pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-reddit-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, tags, users..."
              className="w-full pl-10 pr-10 py-2 bg-reddit-input border border-reddit-border rounded text-reddit-text text-sm placeholder-reddit-textMuted focus:outline-none focus:border-reddit-blue transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-reddit-cardHover rounded transition-colors"
              >
                <X size={16} className="text-reddit-textMuted" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            {quickFilters.map(filter => {
              const Icon = filter.icon;
              const isActive = sortBy === filter.id;
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => setSortBy(filter.id)}
                  whileHover={!isActive ? { backgroundColor: '#272729' } : {}}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-reddit-blue text-white'
                      : 'bg-reddit-card text-reddit-textMuted hover:text-reddit-text border border-reddit-border'
                  }`}
                >
                  <Icon size={14} />
                  <span>{filter.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Main Content - Posts */}
          <div className="lg:col-span-3 space-y-3">
            {/* Active Tag Filter */}
            {selectedTag && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-reddit-card rounded-md p-3 border border-reddit-border flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-reddit-blue" />
                  <span className="text-reddit-text text-sm font-medium">#{selectedTag}</span>
                  <span className="text-reddit-textMuted text-xs">
                    ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'})
                  </span>
                </div>
                <motion.button
                  onClick={() => setSelectedTag(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-reddit-textMuted hover:text-reddit-text transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* Posts */}
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 bg-reddit-card rounded-md border border-reddit-border"
                >
                  <Search size={40} className="text-reddit-textMuted mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-bold text-reddit-text mb-2">
                    No posts found
                  </h3>
                  <p className="text-reddit-textMuted text-sm mb-4">
                    Try adjusting your search or filters
                  </p>
                  {(selectedTag || searchQuery) && (
                    <motion.button
                      onClick={clearFilters}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-reddit-blue hover:bg-reddit-blue/90 text-white text-sm rounded font-medium transition-colors"
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Trending Tags */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-3">
              {/* Trending Tags Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-reddit-card rounded-md border border-reddit-border overflow-hidden"
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-reddit-border">
                  <TrendingUp size={16} className="text-reddit-orange" />
                  <h2 className="text-sm font-bold text-reddit-text">Trending Topics</h2>
                </div>

                <div className="p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {trendingTags.map(({ tag, count }, index) => (
                      <motion.button
                        key={tag}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative px-2 py-2 rounded text-left transition-all ${
                          selectedTag === tag
                            ? 'bg-reddit-blue text-white'
                            : 'bg-reddit-cardHover text-reddit-text hover:bg-reddit-border'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          <Hash size={12} className="mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{tag}</div>
                            <div className={`text-[10px] ${
                              selectedTag === tag ? 'text-blue-200' : 'text-reddit-textMuted'
                            }`}>
                              {count} posts
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {allTags.length > 8 && (
                  <button className="w-full px-3 py-2 text-reddit-blue hover:bg-reddit-cardHover text-xs font-medium border-t border-reddit-border transition-colors">
                    View all topics
                  </button>
                )}
              </motion.div>

              {/* Popular Subjects */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-reddit-card rounded-md border border-reddit-border overflow-hidden"
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-reddit-border">
                  <Sparkles size={16} className="text-reddit-blue" />
                  <h2 className="text-sm font-bold text-reddit-text">Popular Subjects</h2>
                </div>

                <div className="p-2 space-y-1">
                  {['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subject, index) => (
                    <motion.button
                      key={subject}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.03 }}
                      whileHover={{ backgroundColor: '#272729' }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors"
                    >
                      <span className="text-xs text-reddit-text">{subject}</span>
                      <span className="text-[10px] text-reddit-textMuted">{Math.floor(Math.random() * 50) + 10}k</span>
                    </motion.button>
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
