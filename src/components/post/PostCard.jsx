import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit3,
  Trash2,
  Flag,
  Share2,
  User,
  X,
  AlertTriangle,
} from "lucide-react";
import { useStudyGram } from "../../context/StudyGramContext";
import { editPost, deletePost } from "../../api/contents";
import { toast } from "sonner";
import LoadingSpinner from "../common/LoadingSpinner";

const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const navigate = useNavigate();
  const { currentUser, bookmarkedPosts, handleLikePost, handleBookmarkPost } =
    useStudyGram();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const menuRef = useRef(null);

  const isLiked = currentUser && post.likes.includes(currentUser.id);
  const isBookmarked =
    currentUser && bookmarkedPosts.some((p) => p.id === post.id);

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

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
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

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      setShowDeleteModal(false);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
      // Reload the page to refresh the feed
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPost = async () => {
    if (!editContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await editPost(post.id, editContent);
      toast.success("Post updated successfully");
      setShowEditModal(false);
      if (onPostUpdated) {
        onPostUpdated(post.id, editContent);
      }
      // Reload the page to refresh the feed
      window.location.reload();
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);

    switch (action) {
      case "edit":
        setEditContent(post.content);
        setShowEditModal(true);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      case "report":
        toast.info("Report feature coming soon");
        break;
      case "share":
        if (navigator.share) {
          navigator
            .share({
              title: `Post by ${post.user.displayName}`,
              text: post.content,
              url: window.location.origin + `/post/${post.id}`,
            })
            .catch(() => { });
        } else {
          navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
          toast.success("Link copied to clipboard");
        }
        break;
      default:
        break;
    }
  };

  const isOwnPost = currentUser && post.userId === currentUser.id;

  const handleCardClick = (e) => {
    // Don't navigate if text is selected
    if (window.getSelection().toString().length > 0) return;

    navigate(`/post/${post.id}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onClick={handleCardClick}
        className="bg-reddit-item bg-opacity-50 hover:bg-opacity-100 rounded-lg overflow-hidden mb-4 border border-reddit-border hover:border-reddit-textMuted transition-all cursor-pointer"
      >
        {/* Post Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {post.user.avatar && !avatarError ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${post.user.username}`);
                }}
                src={post.user.avatar}
                alt={post.user.displayName}
                onError={() => setAvatarError(true)}
                className="w-8 h-8 rounded-full cursor-pointer object-cover"
              />
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${post.user.username}`);
                }}
                className="w-8 h-8 rounded-full bg-reddit-cardHover flex items-center justify-center cursor-pointer hover:bg-reddit-border transition-colors"
              >
                <User size={16} className="text-reddit-textMuted" />
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${post.user.username}`);
                  }}
                  className="font-semibold text-sm hover:underline cursor-pointer"
                >
                  {post.user.displayName}
                </span>
                <span className="text-reddit-textMuted text-xs">•</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${post.user.username}`);
                  }}
                  className="text-reddit-textMuted text-xs hover:underline cursor-pointer"
                >
                  @{post.user.username}
                </span>
              </div>
              <span className="text-reddit-textMuted text-xs">
                {formatTimestamp(post.timestamp)}
              </span>
            </div>
          </div>

          {/* More Options Menu */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-full text-reddit-textMuted hover:text-reddit-text"
            >
              <MoreHorizontal size={20} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 top-full mt-1 w-44 bg-reddit-card border border-reddit-border rounded shadow-xl overflow-hidden z-50"
                >
                  {isOwnPost && (
                    <motion.button
                      whileHover={{ backgroundColor: "#272729" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuAction("edit");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-reddit-text hover:text-reddit-orange text-sm"
                    >
                      <Edit3 size={14} />
                      <span>Edit Post</span>
                    </motion.button>
                  )}

                  {isOwnPost && (
                    <motion.button
                      whileHover={{ backgroundColor: "#272729" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuAction("delete");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-reddit-text hover:text-red-500 text-sm"
                    >
                      <Trash2 size={14} />
                      <span>Delete Post</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ backgroundColor: "#272729" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction("share");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-reddit-text hover:text-reddit-orange text-sm"
                  >
                    <Share2 size={14} />
                    <span>Share Post</span>
                  </motion.button>

                  {!isOwnPost && (
                    <motion.button
                      whileHover={{ backgroundColor: "#272729" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuAction("report");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-reddit-text hover:text-red-500 text-sm border-t border-reddit-border"
                    >
                      <Flag size={14} />
                      <span>Report Post</span>
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-3 pb-2">
          <p className="text-reddit-text text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Post Images */}
        {post.type !== "text" && post.images && post.images.length > 0 && (
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
              <div className="absolute inset-0 bg-reddit-cardHover animate-pulse"></div>
            )}

            {/* Carousel Controls (only for carousel posts) */}
            {post.type === "carousel" && post.images.length > 1 && (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                        setImageLoaded(false);
                      }}
                      className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50 w-2 hover:bg-white/75"
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

        {/* Post Actions - Reddit Style */}
        <div className="px-3 pb-2 border-t border-reddit-border pt-1">
          <div className="flex items-center justify-between">
            {/* Left Actions */}
            <div className="flex items-center gap-1">
              {/* Like Button */}
              <motion.button
                whileHover={{ backgroundColor: "#272729" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikePost(post.id);
                }}
                className={`flex items-center gap-1 p-2 rounded-full ${isLiked
                  ? "text-reddit-orange"
                  : "text-reddit-textMuted hover:text-reddit-text"
                  }`}
              >
                <Heart
                  size={20}
                  fill={isLiked ? "currentColor" : "none"}
                  strokeWidth={2}
                />
                <span className="text-xs font-bold">{post.likeCount}</span>
              </motion.button>

              {/* Comment Button */}
              <motion.button
                whileHover={{ backgroundColor: "#272729" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${post.id}`);
                }}
                className="flex items-center gap-1 p-2 rounded-full text-reddit-textMuted hover:text-reddit-text"
              >
                <MessageCircle size={20} strokeWidth={2} />
                <span className="text-xs font-bold">{post.commentCount}</span>
              </motion.button>
            </div>

            {/* Bookmark Button */}
            <motion.button
              whileHover={{ backgroundColor: "#272729" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkPost(post.id, post);
              }}
              className={`p-2 rounded-full ${isBookmarked
                ? "text-reddit-orange"
                : "text-reddit-textMuted hover:text-reddit-text"
                }`}
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </motion.button>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ backgroundColor: "#272729" }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-reddit-orange bg-reddit-orange/10 px-2 py-0.5 rounded cursor-pointer"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          )}
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
                  <h3 className="text-lg font-bold text-reddit-text">Delete Post</h3>
                  <p className="text-sm text-reddit-textMuted">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-reddit-text mb-6">
                Are you sure you want to delete this post? This will permanently remove it from your profile and the feed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-reddit-border text-reddit-text rounded-lg hover:bg-reddit-cardHover transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
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

      {/* Edit Post Modal */}
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
                <h3 className="text-lg font-bold text-reddit-text">Edit Post</h3>
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
                  placeholder="What's on your mind?"
                  className="w-full h-40 bg-reddit-input border border-reddit-border rounded-lg p-4 text-reddit-text placeholder-reddit-textMuted resize-none focus:outline-none focus:border-reddit-orange transition-colors"
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
                  onClick={handleEditPost}
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

export default PostCard;
