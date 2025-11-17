import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';
import { getUserById } from '../../data/studygramData';
import Comment from './Comment';

const CommentSection = () => {
  const {
    showComments,
    setShowComments,
    getCommentsForPost,
    addComment,
    posts,
    currentUser
  } = useStudyGram();

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const inputRef = useRef(null);
  const commentsEndRef = useRef(null);

  const post = posts.find((p) => p.id === showComments);
  const comments = showComments ? getCommentsForPost(showComments) : [];

  useEffect(() => {
    if (showComments && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showComments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(showComments, commentText, replyingTo?.id);
    setCommentText('');
    setReplyingTo(null);

    // Scroll to bottom after adding comment
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setShowComments(null);
    setCommentText('');
    setReplyingTo(null);
  };

  if (!showComments || !post) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div>
              <h3 className="text-white font-bold text-lg">Comments</h3>
              <p className="text-gray-400 text-sm">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </p>
            </div>
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="text-gray-500 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-800"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Post Preview */}
          <div className="p-4 bg-gray-800/30 border-b border-gray-800">
            <div className="flex items-start gap-3">
              <img
                src={post.user.avatar}
                alt={post.user.displayName}
                className="w-10 h-10 rounded-full border border-gray-700"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-sm">
                    {post.user.displayName}
                  </span>
                  <span className="text-gray-500 text-xs">
                    @{post.user.username}
                  </span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {post.content}
                </p>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4">
            {comments.length > 0 ? (
              <>
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    postId={showComments}
                    onReply={handleReply}
                  />
                ))}
                <div ref={commentsEndRef} />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h4 className="text-white font-semibold mb-2">No comments yet</h4>
                <p className="text-gray-400 text-sm text-center max-w-xs">
                  Be the first to share your thoughts on this post!
                </p>
              </motion.div>
            )}
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 mb-2 text-sm"
              >
                <span className="text-gray-400">
                  Replying to{' '}
                  <span className="text-blue-400 font-semibold">
                    {getUserById(replyingTo.userId)?.displayName}
                  </span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  <X size={14} />
                </motion.button>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex items-start gap-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                className="w-10 h-10 rounded-full border border-gray-700 flex-shrink-0 mt-1"
              />
              <div className="flex-1 flex items-start gap-2">
                <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700">
                  <textarea
                    ref={inputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      replyingTo
                        ? 'Write your reply...'
                        : 'Write a comment...'
                    }
                    rows={1}
                    className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 outline-none resize-none max-h-32 overflow-y-auto"
                    style={{ minHeight: '44px' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={!commentText.trim()}
                  whileHover={commentText.trim() ? { scale: 1.02 } : {}}
                  whileTap={commentText.trim() ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
                    commentText.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </form>
            <p className="text-gray-500 text-xs mt-2">
              Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Shift+Enter</kbd> for new line
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentSection;