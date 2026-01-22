import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useFeed } from "../../context/FeedContext";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../post/PostCard";
import { FeedSkeleton } from "../common/Skeleton";
import { Layout, Loader2 } from "lucide-react";

const POSTS_PER_BATCH = 5;

const Feed = ({ activeTab }) => {
  const {
    posts,
    isFeedLoading,
    updatePostInState,
    deletePostFromState
  } = useFeed();
  const { currentUser } = useAuth();
  const feedRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_BATCH);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredPosts = activeTab === 'following'
    ? posts.filter(post => currentUser?.following?.includes(post.userId))
    : posts;

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // Load more posts
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Small delay for smooth UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + POSTS_PER_BATCH, filteredPosts.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, filteredPosts.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // Reset visible count when tab changes or posts update
  useEffect(() => {
    setVisibleCount(POSTS_PER_BATCH);
  }, [activeTab, posts.length]);

  // Handlers for optimistic updates
  const handlePostUpdated = (postId, newContent) => {
    updatePostInState(postId, newContent);
  };

  const handlePostDeleted = (postId) => {
    deletePostFromState(postId);
  };

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("feed-scroll-position");
    const currentFeedRef = feedRef.current;

    if (savedPosition && currentFeedRef) {
      currentFeedRef.scrollTop = parseInt(savedPosition, 10);
    }

    return () => {
      if (currentFeedRef) {
        sessionStorage.setItem(
          "feed-scroll-position",
          currentFeedRef.scrollTop
        );
      }
    };
  }, []);

  if (isFeedLoading) {
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

      {!hasMore && filteredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-8 text-center"
        >
          <p className="text-reddit-textMuted text-xs">You're all caught up!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Feed;
