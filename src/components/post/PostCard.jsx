import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const PostCard = ({ post }) => {
  const {
    isAuthenticated,
    currentUser,
    handleLikePost,
    handleBookmarkPost,
    handleCommentClick
  } = useStudyGram();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLiked = currentUser && post.likes.includes(currentUser.id);
  const isBookmarked = currentUser && post.bookmarkedBy.includes(currentUser.id);

  const nextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageLoaded(false);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setImageLoaded(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden mb-4"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            src={post.user.avatar}
            alt={post.user.displayName}
            className="w-10 h-10 rounded-full border-2 border-blue-600 cursor-pointer"
          />
          <div>
            <h3 className="text-white font-semibold text-sm hover:text-blue-400 cursor-pointer transition-colors duration-200">
              {post.user.displayName}
            </h3>
            <p className="text-gray-500 text-xs">
              @{post.user.username} · {formatTimestamp(post.timestamp)}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500 hover:text-white transition-colors duration-200 p-2"
        >
          <MoreHorizontal size={20} />
        </motion.button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Images */}
      {post.type !== 'text' && post.images && post.images.length > 0 && (
        <div className="relative bg-black group">
          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <img
              src={post.images[currentImageIndex].url}
              alt={post.images[currentImageIndex].alt}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
          )}

          {/* Carousel Controls (only for carousel posts) */}
          {post.type === 'carousel' && post.images.length > 1 && (
            <>
              {/* Previous Button */}
              <AnimatePresence>
                {currentImageIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Next Button */}
              <AnimatePresence>
                {currentImageIndex < post.images.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.images.map((_, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setImageLoaded(false);
                    }}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50 w-2 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                {currentImageIndex + 1} / {post.images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleLikePost(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isLiked
                  ? 'text-red-500 bg-red-500/10'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={20}
                  fill={isLiked ? 'currentColor' : 'none'}
                  strokeWidth={2}
                />
              </motion.div>
              <span className="font-medium text-sm">{post.likeCount}</span>
            </motion.button>

            {/* Comment Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleCommentClick(post.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-600/10 transition-all duration-200"
            >
              <MessageCircle size={20} strokeWidth={2} />
              <span className="font-medium text-sm">{post.commentCount}</span>
            </motion.button>
          </div>

          {/* Bookmark Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleBookmarkPost(post.id)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isBookmarked
                ? 'text-yellow-500 bg-yellow-500/10'
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10'
            }`}
          >
            <Bookmark
              size={20}
              fill={isBookmarked ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-800">
            {post.tags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-600/20 transition-colors duration-200"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default PostCard;