import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFeed } from "../../context/FeedContext";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../post/PostCard";
import { FeedSkeleton } from "../common/Skeleton";
import { Layout, Loader2, RefreshCw } from "lucide-react";

const POSTS_PER_BATCH = 5;

const Feed = ({ activeTab }) => {
  const {
    posts,
    isFeedLoading,
    updatePostInState,
    deletePostFromState,
    fetchFeedPosts,
    loadingState,
    feedMode,
    hasMore,
    personalizedExhausted,
    hasNewBackgroundPosts,
    applyBackgroundPosts,
    loadMorePosts,
    FEED_TYPES
  } = useFeed();
  const { currentUser } = useAuth();
  const loadMoreRef = useRef(null);

  // Pagination state for local display
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_BATCH);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const filteredPosts = activeTab === 'following'
    ? posts.filter(post => currentUser?.following?.includes(post.userId))
    : posts;

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMoreLocal = visibleCount < filteredPosts.length;

  // Background refresh polling
  useEffect(() => {
    if (activeTab !== 'following') {
      const interval = setInterval(() => {
        fetchFeedPosts({ isQuiet: true, feedType: feedMode === 'personalized' ? FEED_TYPES.PERSONALIZED : FEED_TYPES.DISCOVERY });
      }, 60000); // Poll every minute
      return () => clearInterval(interval);
    }
  }, [fetchFeedPosts, activeTab, feedMode, FEED_TYPES]);

  // Load more posts
  const handleLoadMore = useCallback(async () => {
    if (loadingState === 'loadingMore' || isLocalLoading) return;

    if (visibleCount < filteredPosts.length) {
      // Show more local posts first
      setIsLocalLoading(true);
      setTimeout(() => {
        setVisibleCount(prev => prev + POSTS_PER_BATCH);
        setIsLocalLoading(false);
      }, 300);
    } else if (hasMore || (feedMode === 'personalized' && !personalizedExhausted)) {
      // Fetch more from server
      await loadMorePosts();
    }
  }, [loadingState, isLocalLoading, visibleCount, filteredPosts.length, hasMore, feedMode, personalizedExhausted, loadMorePosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  // Reset visible count when tab changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_BATCH);
  }, [activeTab]);

  // Handlers for optimistic updates
  const handlePostUpdated = (postId, newContent) => {
    updatePostInState(postId, newContent);
  };

  const handlePostDeleted = (postId) => {
    deletePostFromState(postId);
  };

  if (isFeedLoading && posts.length === 0) {
    return (
      <div className="flex-1 max-w-[640px] mx-auto px-4 pt-4 pb-5">
        <FeedSkeleton count={4} />
      </div>
    );
  }

  if (loadingState === 'error' && posts.length === 0) {
    return (
      <div className="flex-1 max-w-[640px] mx-auto px-4 pt-4 pb-5 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Layout size={32} className="text-red-500" />
        </div>
        <h3 className="text-reddit-text text-lg font-semibold mb-2">Failed to load feed</h3>
        <p className="text-reddit-textMuted text-sm mb-4">
          We couldn't reach the server. Please check your internet connection or try again later.
        </p>
        <button
          onClick={() => fetchFeedPosts({ forceLoading: true })}
          className="px-4 py-2 bg-reddit-orange text-white rounded-full font-bold hover:bg-reddit-orange/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex-1 max-w-[640px] mx-auto px-4 pt-4 pb-5"
    >
      {/* New Posts Indicator */}
      <AnimatePresence>
        {hasNewBackgroundPosts && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-4 z-50 flex justify-center mb-4"
          >
            <button
              onClick={applyBackgroundPosts}
              className="bg-reddit-orange text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-reddit-orange/90 transition-colors"
            >
              <RefreshCw size={16} className="animate-spin-slow" />
              New posts available
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {displayedPosts && displayedPosts.length > 0 ? (
          <>
            {displayedPosts.map((post, index) => {
              return (
                <React.Fragment key={post.id || `post-${index}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 4) * 0.02, duration: 0.3 }}
                  >
                    <PostCard
                      post={post}
                      onPostUpdated={handlePostUpdated}
                      onPostDeleted={handlePostDeleted}
                    />
                  </motion.div>
                </React.Fragment>
              );
            })}

            {/* Discovery Separator */}
            {personalizedExhausted && feedMode === 'discovery' && (
              <div className="py-6 text-center border-t border-reddit-border mt-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-reddit-orange font-semibold text-sm">
                  <Layout size={16} />
                  <span>Showing Discovery Feed</span>
                </div>
              </div>
            )}

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-10">
              {(loadingState === 'loadingMore' || isLocalLoading) && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 text-reddit-textMuted">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Fetching more posts...</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 bg-reddit-cardHover rounded-full flex items-center justify-center mb-4">
              <Layout size={32} className="text-reddit-textMuted opacity-50" />
            </div>
            <h3 className="text-reddit-text text-lg font-semibold mb-2">
              No posts yet
            </h3>
            <p className="text-reddit-textMuted text-center max-w-md text-sm">
              Start following users or create your first post to see content
              here!
            </p>
          </motion.div>
        )}
      </div>

      {!hasMore && !hasMoreLocal && displayedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-12 text-center"
        >
          <p className="text-reddit-textMuted text-xs font-medium uppercase tracking-widest">
            End of the line. You've seen it all!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Feed;
