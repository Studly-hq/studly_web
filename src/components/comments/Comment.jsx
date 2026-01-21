import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Edit3,
  Trash2,
  Flag,
  X,
  AlertTriangle,
  Send,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFeed } from "../../context/FeedContext";
import { editComment, deleteComment } from "../../api/contents";
import { toast } from "sonner";
import LoadingSpinner from "../common/LoadingSpinner";

const Comment = ({ comment, postId, isReply = false, onReply, onCommentDeleted, onCommentUpdated }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { handleLikeComment, requireAuth, addComment } = useFeed();
  const [showReplies, setShowReplies] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const menuRef = useRef(null);

  const commentUser = comment.user; // Use the user object directly from data
  // Safe check for likes array in case it's missing
  const isLiked =
    currentUser &&
    Array.isArray(comment.likes) &&
    comment.likes.includes(currentUser.id);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    // Verify if timestamp is SQL format (no T, no Z) and append Z to treat as UTC
    let timeStr = timestamp;
    if (typeof timestamp === "string") {
      if (!timestamp.includes("Z") && !timestamp.includes("+")) {
        // Replace space with T if needed, though strictly appending Z might work for most parsers if ISO-like
        // Safer: replace " " with "T" and append "Z"
        timeStr = timestamp.replace(" ", "T") + "Z";
      }
    }
    const commentDate = new Date(timeStr);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return commentDate.toLocaleDateString();
  };

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");  // ... (existing code)

  const handleReplyClick = () => {
    if (!requireAuth({ type: "comment", postId })) return;
    setIsReplying(!isReplying);
    // Focus logic can be handled in useEffect if needed, or autoFocus on input
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const success = await addComment(postId, replyContent, comment.id);
    if (success) {
      setReplyContent("");
      setIsReplying(false);
      setShowReplies(true); // Auto-open replies to show the new one
      toast.success("Reply posted!");
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  const handleDeleteComment = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      toast.success("Comment deleted successfully");
      setShowDeleteModal(false);
      if (onCommentDeleted) {
        onCommentDeleted(comment.id);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error(error.response?.data?.error || "Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditComment = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await editComment(comment.id, editContent, comment.userId, postId);
      toast.success("Comment updated successfully");
      setShowEditModal(false);
      if (onCommentUpdated) {
        onCommentUpdated(comment.id, editContent);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error(error.response?.data?.error || "Failed to update comment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);

    switch (action) {
      case "edit":
        setEditContent(comment.content);
        setShowEditModal(true);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      case "report":
        toast.info("Report feature coming soon");
        break;
      default:
        break;
    }
  };

  const isOwnComment = currentUser && (
    (currentUser.id && String(comment.userId) === String(currentUser.id)) ||
    (currentUser.username && comment.user?.username === currentUser.username)
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className={`${isReply ? "ml-12 mt-3" : "mt-4"}`}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/profile/${comment.userId}`)}
            src={commentUser?.avatar}
            alt={commentUser?.username}
            className="w-8 h-8 rounded-full border border-reddit-border cursor-pointer flex-shrink-0"
          />

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="group/content relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => navigate(`/profile/${comment.userId}`)}
                    className="text-reddit-text font-bold text-sm hover:text-reddit-orange cursor-pointer transition-colors"
                  >
                    {commentUser?.username}
                  </span>
                  <span className="text-reddit-textMuted text-[10px]">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
                <div className="relative" ref={menuRef}>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full text-reddit-textMuted hover:text-reddit-text transition-colors"
                  >
                    <MoreHorizontal size={14} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 top-full mt-2 w-44 bg-reddit-card border border-reddit-border rounded overflow-hidden z-50"
                      >
                        {isOwnComment && (
                          <motion.button
                            whileHover={{ backgroundColor: "#272729" }}
                            onClick={() => handleMenuAction("edit")}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-reddit-text hover:text-reddit-orange transition-colors text-sm"
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </motion.button>
                        )}

                        {isOwnComment && (
                          <motion.button
                            whileHover={{ backgroundColor: "#272729" }}
                            onClick={() => handleMenuAction("delete")}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-reddit-text hover:text-red-500 transition-colors text-sm"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </motion.button>
                        )}

                        {!isOwnComment && (
                          <motion.button
                            whileHover={{ backgroundColor: "#272729" }}
                            onClick={() => handleMenuAction("report")}
                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-reddit-text hover:text-red-500 transition-colors text-sm"
                          >
                            <Flag size={14} />
                            <span>Report</span>
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <p className="text-reddit-text text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>

            {/* Inline Reply Input */}
            <AnimatePresence>
              {isReplying && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <form onSubmit={handleSubmitReply} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-reddit-cardHover border border-reddit-border flex-shrink-0 overflow-hidden mt-1">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt="You" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-reddit-cardHover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-reddit-input rounded border border-white/10 focus-within:border-white/20 transition-colors flex items-center pr-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to ${commentUser?.username}...`}
                          className="flex-1 bg-transparent border-none text-sm text-white placeholder-white/20 px-3 py-2 outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!replyContent.trim()}
                          className="p-1.5 rounded-full hover:bg-white/10 text-reddit-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comment Actions */}
            <div className="flex items-center gap-4 mt-2 px-2">
              {/* Like - only show on top-level comments, not replies */}
              {!isReply && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleLikeComment(postId, comment.id)}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors duration-200 ${isLiked
                    ? "text-reddit-orange"
                    : "text-reddit-textMuted hover:text-reddit-orange"
                    }`}
                >
                  <Heart
                    size={14}
                    fill={isLiked ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                  {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
                </motion.button>
              )}

              {/* Reply */}
              {!isReply && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleReplyClick}
                  className="flex items-center gap-1 text-xs font-medium text-reddit-textMuted hover:text-reddit-orange transition-colors duration-200"
                >
                  <MessageCircle size={14} strokeWidth={2} />
                  <span>Reply</span>
                </motion.button>
              )}

              {/* View Replies Toggle - allow on any comment that has replies */}
              {comment.replies && comment.replies.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs font-medium text-reddit-orange hover:text-reddit-orange/80 transition-colors duration-200"
                >
                  {showReplies ? "Hide" : "View"} {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "reply" : "replies"}
                </motion.button>
              )}
            </div>

            {/* Replies - allow nesting for any comment depth */}
            {comment.replies && comment.replies.length > 0 && (
              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
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
                        onCommentDeleted={onCommentDeleted}
                        onCommentUpdated={onCommentUpdated}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-reddit-card border border-reddit-border rounded-xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertTriangle size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-reddit-text">Delete Comment</h3>
                  <p className="text-sm text-reddit-textMuted">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-reddit-text mb-6">
                Are you sure you want to delete this comment? This will permanently remove it.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-reddit-border text-reddit-text rounded-lg hover:bg-reddit-cardHover transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComment}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner size={16} color="#ffffff" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Comment Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-reddit-card border border-reddit-border rounded-xl w-full max-w-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-reddit-border">
                <h3 className="text-lg font-bold text-reddit-text">Edit Comment</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-reddit-cardHover rounded-full transition-colors"
                >
                  <X size={20} className="text-reddit-textMuted" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment..."
                  className="w-full h-32 bg-reddit-input border border-reddit-border rounded-lg p-4 text-reddit-text placeholder-reddit-textMuted resize-none focus:outline-none focus:border-reddit-orange transition-colors"
                />
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-reddit-border">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-reddit-border text-reddit-text rounded-lg hover:bg-reddit-cardHover transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditComment}
                  disabled={isSaving || !editContent.trim()}
                  className="flex-1 px-4 py-2 bg-reddit-orange hover:bg-reddit-orange/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size={16} color="#ffffff" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Comment;
