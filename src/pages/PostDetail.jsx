import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useStudyGram } from "../context/StudyGramContext";
import PostCard from "../components/post/PostCard";
import Comment from "../components/comments/Comment";
import LoadingSpinner from "../components/common/LoadingSpinner";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {
    fetchPostById,
    fetchCommentsForPost,
    getCommentsForPost,
    addComment,
    currentUser,
  } = useStudyGram();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment State
  const [commentText, setCommentText] = useState("");
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(postId, commentText);
    setCommentText("");
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
          className="flex items-center gap-2 text-reddit-blue hover:underline"
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
          <PostCard post={post} />
        </motion.div>

        {/* Embedded Comment Section */}
        <div className="bg-reddit-card border border-reddit-border rounded-lg mt-4 overflow-hidden">
          <div className="p-4 border-b border-reddit-border">
            <h3 className="font-bold text-lg">Comments</h3>
          </div>

          {/* Comment Input */}
          <div className="p-4 bg-reddit-cardHover/10 border-b border-reddit-border">
            <form onSubmit={handleCommentSubmit} className="flex gap-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-reddit-input rounded-md px-4 py-2 outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-reddit-blue text-white px-4 py-2 rounded-md disabled:opacity-50 text-sm font-semibold"
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* Comment List */}
          <div className="p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id}>
                  <Comment comment={comment} postId={postId} />
                </div>
              ))
            ) : (
              <div className="text-center text-reddit-textMuted py-8">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
