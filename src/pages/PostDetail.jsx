import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, User } from "lucide-react";
import PostCard from "../components/post/PostCard";
import Comment from "../components/comments/Comment";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useFeed } from "../context/FeedContext";
import { useUI } from "../context/UIContext";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    isAuthenticated,
  } = useAuth();

  const {
    fetchPostById,
    fetchCommentsForPost,
    getCommentsForPost,
    addComment,
    updatePostInState,
    deletePostFromState,
    updateCommentInState,
    deleteCommentFromState,
    posts
  } = useFeed();

  const { setShowAuthModal } = useUI();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment State
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const comments = getCommentsForPost(postId);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const fetchedPost = await fetchPostById(postId);
      if (fetchedPost) {
        setPost(fetchedPost);
        await fetchCommentsForPost(postId);
      } else {
        setError("Post not found, Please try again!");
      }
      setLoading(false);
    };

    if (postId) {
      loadPost();
    }
  }, [postId, fetchPostById, fetchCommentsForPost]);

  // Sync local post state with global posts state (for real-time like updates)
  useEffect(() => {
    if (post && posts.length > 0) {
      const updatedPost = posts.find(p => String(p.id) === String(postId));
      if (updatedPost && (updatedPost.likeCount !== post.likeCount || updatedPost.likes.length !== post.likes.length)) {
        setPost(prev => ({ ...prev, likeCount: updatedPost.likeCount, likes: updatedPost.likes }));
      }
    }
  }, [posts, postId, post]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await addComment(postId, commentText);
      setCommentText("");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-reddit-bg text-reddit-text">
        <LoadingSpinner size={50} color="#FF4500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center mt-4 h-screen bg-reddit-bg text-reddit-text">
        <p className="text-xl mb-4">{error || "Post not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-reddit-orange hover:underline"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-reddit-bg min-h-screen text-reddit-text p-4 mt-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-reddit-textMuted hover:text-reddit-text transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PostCard
            post={post}
            onPostUpdated={(postId, newContent) => {
              setPost(prev => ({ ...prev, content: newContent }));
              updatePostInState(postId, newContent);
            }}
            onPostDeleted={() => {
              deletePostFromState(postId);
              navigate(-1);
            }}
          />
        </motion.div>

        {/* Embedded Comment Section */}
        <div className="mt-8">
          <div className="pb-4 border-b border-reddit-border/50 mb-6">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <MessageSquare size={20} className="text-reddit-orange" />
              Comments
              <span className="text-sm font-normal text-reddit-textMuted ml-1">
                ({comments.length})
              </span>
            </h3>
          </div>

          {/* Comment Input */}
          <div className="mb-8">
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-4">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser?.displayName}
                    className="w-10 h-10 rounded-full border border-reddit-border object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex items-center justify-center border border-reddit-border">
                    <User size={20} className="text-reddit-textMuted" />
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="w-full bg-reddit-input rounded-xl border border-transparent hover:border-reddit-orange focus-within:border-reddit-orange focus-within:ring-1 focus-within:ring-reddit-orange transition-all duration-200">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      disabled={isSubmittingComment}
                      className="w-full bg-transparent text-reddit-text placeholder-reddit-textMuted px-4 py-3 !outline-none !border-none !ring-0 text-sm resize-none min-h-[100px] disabled:opacity-50 block"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim() || isSubmittingComment}
                      className="bg-reddit-orange hover:bg-reddit-orange/90 text-white px-6 py-2 rounded-full disabled:opacity-50 text-sm font-bold transition-all flex items-center gap-2"
                    >
                      {isSubmittingComment && <LoadingSpinner size={14} color="#ffffff" />}
                      {isSubmittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-8 bg-reddit-cardHover/5 rounded-2xl border border-dashed border-reddit-border flex flex-col items-center gap-3">
                <p className="text-reddit-textMuted">Join the conversation</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-reddit-orange hover:bg-reddit-orange/90 text-white px-8 py-2 rounded-full text-sm font-bold transition-all"
                >
                  Log in to Comment
                </button>
              </div>
            )}
          </div>

          {/* Comment List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id}>
                  <Comment
                    comment={comment}
                    postId={postId}
                    onCommentUpdated={(commentId, content) => updateCommentInState(postId, commentId, content)}
                    onCommentDeleted={(commentId) => deleteCommentFromState(postId, commentId)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-reddit-textMuted py-16 flex flex-col items-center gap-4 bg-reddit-cardHover/5 rounded-2xl border border-dashed border-reddit-border">
                <div className="w-16 h-16 rounded-full bg-reddit-cardHover flex items-center justify-center">
                  <MessageSquare size={32} className="opacity-30" />
                </div>
                <div>
                  <h4 className="font-bold text-reddit-text">No comments yet</h4>
                  <p className="text-sm">Be the first to share your thoughts!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
