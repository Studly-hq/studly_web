import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useStudyGram } from "../../context/StudyGramContext";
import PostCard from "../post/PostCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { Layout } from "lucide-react";

const Feed = ({ activeTab }) => {
  const { posts, currentUser, isFeedLoading } = useStudyGram();
  const feedRef = useRef(null);

  const displayedPosts = activeTab === 'following'
    ? posts.filter(post => currentUser?.following?.includes(post.userId))
    : posts;

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
      <div className="flex justify-center p-10">
        <LoadingSpinner size={50} color="#FF4500" />
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
          displayedPosts.map((post, index) => (
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
