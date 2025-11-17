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
    if (savedPosition && feedRef.current) {
      feedRef.current.scrollTop = parseInt(savedPosition, 10);
    }

    return () => {
      if (feedRef.current) {
        sessionStorage.setItem('feed-scroll-position', feedRef.current.scrollTop);
      }
    };
  }, []);

  return (
    <div
      ref={feedRef}
      className="flex-1 max-w-2xl mx-auto px-4 py-6 overflow-y-auto"
    >
      {/* Feed Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          For You
        </h2>
        <p className="text-gray-400 text-sm">
          Study content curated just for you
        </p>
      </motion.div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No posts yet
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              Start following users or create your first post to see content here!
            </p>
          </motion.div>
        )}
      </div>

      {/* Loading More Indicator (placeholder for future infinite scroll) */}
      {posts && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-8 text-center"
        >
          <p className="text-gray-500 text-sm">You're all caught up! 🎉</p>
        </motion.div>
      )}
    </div>
  );
};

export default Feed;