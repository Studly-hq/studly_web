import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStudyGram } from '../../context/StudyGramContext';
import PostCard from '../post/PostCard';

const Feed = () => {
  const { posts } = useStudyGram();
  const feedRef = useRef(null);

  useEffect(() => {
    // Scroll restoration
    const savedPosition = sessionStorage.getItem('feed-scroll-position');
    const currentFeedRef = feedRef.current;

    if (savedPosition && currentFeedRef) {
      currentFeedRef.scrollTop = parseInt(savedPosition, 10);
    }

    return () => {
      if (currentFeedRef) {
        sessionStorage.setItem('feed-scroll-position', currentFeedRef.scrollTop);
      }
    };
  }, []);

  return (
    <div
      ref={feedRef}
      className="flex-1 max-w-[640px] mx-auto px-4 py-5 overflow-y-auto"
    >
      {/* Posts List - Reddit Style: Clean, minimal spacing */}
      <div className="space-y-3">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-reddit-card border border-reddit-border rounded-md"
          >
            <div className="w-16 h-16 bg-reddit-cardHover rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-reddit-text text-lg font-semibold mb-2">
              No posts yet
            </h3>
            <p className="text-reddit-textMuted text-center max-w-md text-sm">
              Start following users or create your first post to see content here!
            </p>
          </motion.div>
        )}
      </div>

      {/* Loading More Indicator */}
      {posts && posts.length > 0 && (
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