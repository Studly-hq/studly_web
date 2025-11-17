import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';
import { getUserById } from '../../data/studygramData';

const Comment = ({ comment, postId, isReply = false, onReply }) => {
  const { currentUser, handleLikeComment, requireAuth } = useStudyGram();
  const [showReplies, setShowReplies] = useState(true);

  const commentUser = getUserById(comment.userId);
  const isLiked = currentUser && comment.likes.includes(currentUser.id);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return commentDate.toLocaleDateString();
  };

  const handleReplyClick = () => {
    if (!requireAuth({ type: 'comment', postId })) return;
    onReply(comment);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={`${isReply ? 'ml-12 mt-3' : 'mt-4'}`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          src={commentUser?.avatar}
          alt={commentUser?.displayName}
          className="w-8 h-8 rounded-full border border-gray-800 cursor-pointer flex-shrink-0"
        />

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-800/50 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm hover:text-blue-400 cursor-pointer transition-colors duration-200">
                  {commentUser?.displayName}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                <MoreHorizontal size={14} />
              </motion.button>
            </div>

            <p className="text-gray-200 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 px-2">
            {/* Like */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleLikeComment(comment.id, postId)}
              className={`flex items-center gap-1 text-xs font-medium transition-colors duration-200 ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart
                size={14}
                fill={isLiked ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
              {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
            </motion.button>

            {/* Reply */}
            {!isReply && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={handleReplyClick}
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <MessageCircle size={14} strokeWidth={2} />
                <span>Reply</span>
              </motion.button>
            )}

            {/* View Replies Toggle */}
            {!isReply && comment.replies && comment.replies.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                {showReplies ? 'Hide' : 'View'} {comment.replies.length}{' '}
                {comment.replies.length === 1 ? 'reply' : 'replies'}
              </motion.button>
            )}
          </div>

          {/* Replies */}
          {!isReply && comment.replies && comment.replies.length > 0 && (
            <AnimatePresence>
              {showReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  {comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      postId={postId}
                      isReply={true}
                      onReply={onReply}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;