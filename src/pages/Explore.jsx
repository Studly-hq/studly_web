import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, X, Flame, Sparkles, Clock } from 'lucide-react';
import { useFeed } from '../context/FeedContext';
import PostCard from '../components/post/PostCard';

const Explore = () => {
  const { posts, updatePostInState, deletePostFromState } = useFeed();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('trending'); // trending, recent, top

  // Sync search query with URL parameter changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams, searchQuery]);

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
    .slice(0, 4)
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
    <div className="min-h-screen bg-reddit-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-reddit-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, tags, users..."
              className="w-full pl-10 pr-10 py-2 bg-reddit-input border border-reddit-border rounded text-reddit-text text-sm placeholder-reddit-textMuted focus:outline-none focus:border-reddit-orange transition-colors"
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
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all ${isActive
                    ? 'bg-reddit-orange text-white'
                    : 'bg-reddit-card text-reddit-textMuted hover:text-reddit-orange hover:border-reddit-orange border border-reddit-border'
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
                  <Hash size={16} className="text-reddit-orange" />
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
                  className="flex flex-col items-center justify-center py-20"
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
                      className="px-4 py-2 bg-reddit-orange hover:bg-reddit-orange/90 text-white text-sm rounded font-medium transition-colors"
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
                    <PostCard
                      post={post}
                      onPostUpdated={updatePostInState}
                      onPostDeleted={deletePostFromState}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Trending Tags */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-32 space-y-3">
              {/* Trending Topics - Sleeker Design */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-reddit-border/50 mb-2">
                  <TrendingUp size={16} className="text-reddit-orange" />
                  <h2 className="text-sm font-bold text-reddit-text tracking-wide uppercase">Trending Topics</h2>
                </div>

                <div className="space-y-1">
                  {trendingTags.map(({ tag, count }, index) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      whileHover={{ backgroundColor: selectedTag === tag ? undefined : 'rgba(255,255,255,0.03)' }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${selectedTag === tag
                        ? 'bg-reddit-orange text-white shadow-lg shadow-reddit-orange/10'
                        : 'text-reddit-text'
                        }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Hash size={14} className={selectedTag === tag ? 'text-white' : 'text-reddit-orange'} />
                        <span className={`text-sm font-medium truncate ${selectedTag === tag ? 'text-white' : 'text-reddit-text'}`}>{tag}</span>
                      </div>
                      <span className={`text-xs ${selectedTag === tag ? 'text-white/80' : 'text-reddit-textMuted'}`}>
                        {count} {count === 1 ? 'post' : 'posts'}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {allTags.length > 4 && (
                  <button className="w-full mt-2 px-3 py-2 text-reddit-orange hover:text-reddit-orange/80 text-xs font-bold transition-colors text-right">
                    View all topics →
                  </button>
                )}
              </motion.div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
