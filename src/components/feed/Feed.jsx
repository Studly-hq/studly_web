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
    isDiscoveryMode,
    hasMorePersonalized,
    hasNewBackgroundPosts,
    applyBackgroundPosts
  } = useFeed();
  const { currentUser } = useAuth();
  const feedRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Pagination state for local display
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_BATCH);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredPosts = activeTab === 'following'
    ? posts.filter(post => currentUser?.following?.includes(post.userId))
    : posts;

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMoreLocal = visibleCount < filteredPosts.length;

  // Background refresh polling
  useEffect(() => {
    if (activeTab !== 'following') {
      const interval = setInterval(() => {
        fetchFeedPosts({ isQuiet: true, isPersonalized: activeTab !== 'following' });
      }, 60000); // Poll every minute
      return () => clearInterval(interval);
    }
  }, [fetchFeedPosts, activeTab]);

  // Load more posts
  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;

    // 1. If we have more posts already in state but not displayed, show them
    if (hasMoreLocal) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + POSTS_PER_BATCH, filteredPosts.length));
        setIsLoadingMore(false);
      }, 300);
      return;
    }

    // 2. If we are in personalized mode and run out of posts, enter discovery mode
    if (activeTab !== 'following' && !isDiscoveryMode && !hasMorePersonalized) {
      setIsLoadingMore(true);
      await fetchFeedPosts({ append: true, isPersonalized: false }); // Fetch public posts
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreLocal, filteredPosts.length, activeTab, isDiscoveryMode, hasMorePersonalized, fetchFeedPosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isLoadingMore, loadMore]);

  // Reset visible count when tab changes or posts update meaningfully
  useEffect(() => {
    if (!isLoadingMore) {
      setVisibleCount(POSTS_PER_BATCH);
    }
  }, [activeTab, isLoadingMore]);

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

  return (
    <div
      ref={feedRef}
      className="flex-1 max-w-[640px] mx-auto px-4 pt-4 pb-5 overflow-y-auto"
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
            {displayedPosts.map((post, index) => (
              <motion.div
                key={post.id || `post-${index}`}
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
            ))}

            {/* Discovery Separator */}
            {isDiscoveryMode && visibleCount >= posts.length && (
              <div className="py-8 text-center border-t border-reddit-border mt-8">
                <p className="text-reddit-text font-bold mb-1">You've caught up on your feed!</p>
                <p className="text-reddit-textMuted text-sm">Discover more from the Studly community below.</p>
              </div>
            )}

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-4">
              {isLoadingMore && (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 text-reddit-orange animate-spin" />
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

      {!hasMoreLocal && displayedPosts.length > 0 && isDiscoveryMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-8 text-center"
        >
          <p className="text-reddit-textMuted text-xs">You're all caught up with discovery too!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Feed;
