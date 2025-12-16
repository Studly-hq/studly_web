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
} from "lucide-react";
import { useStudyGram } from "../../context/StudyGramContext";
// import { getUserById } from '../../data/studygramData'; // Removed mock data dependency

const Comment = ({ comment, postId, isReply = false, onReply }) => {
  const navigate = useNavigate();
  const { currentUser, handleLikeComment, requireAuth } = useStudyGram();
  const [showReplies, setShowReplies] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
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

  const handleReplyClick = () => {
    if (!requireAuth({ type: "comment", postId })) return;
    onReply(comment);
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

  const handleMenuAction = (action) => {
    setShowMenu(false);

    switch (action) {
      case "edit":
        // TODO: Implement edit comment functionality
        console.log("Edit comment:", comment.id);
        break;
      case "delete":
        // TODO: Implement delete comment functionality
        console.log("Delete comment:", comment.id);
        break;
      case "report":
        // TODO: Implement report comment functionality
        console.log("Report comment:", comment.id);
        break;
      default:
        break;
    }
  };

  const isOwnComment = currentUser && comment.userId === currentUser.id;

  return (
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
          <div className="bg-reddit-cardHover rounded px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  onClick={() => navigate(`/profile/${comment.userId}`)}
                  className="text-reddit-text font-semibold text-sm hover:text-reddit-blue cursor-pointer transition-colors duration-200"
                >
                  {commentUser?.username}
                </span>
                <span className="text-reddit-textMuted text-xs">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-reddit-textMuted hover:text-reddit-text transition-colors duration-200"
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
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-reddit-text hover:text-reddit-blue transition-colors text-sm"
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

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 px-2">
            {/* Like */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleLikeComment(comment.id, postId)}
              className={`flex items-center gap-1 text-xs font-medium transition-colors duration-200 ${
                isLiked
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

            {/* Reply */}
            {!isReply && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={handleReplyClick}
                className="flex items-center gap-1 text-xs font-medium text-reddit-textMuted hover:text-reddit-blue transition-colors duration-200"
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
                className="text-xs font-medium text-reddit-blue hover:text-reddit-blue/80 transition-colors duration-200"
              >
                {showReplies ? "Hide" : "View"} {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </motion.button>
            )}
          </div>

          {/* Replies */}
          {!isReply && comment.replies && comment.replies.length > 0 && (
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
