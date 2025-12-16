import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useStudyGram } from "../context/StudyGramContext";
import PostCard from "../components/post/PostCard";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { fetchPostById } = useStudyGram();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const fetchedPost = await fetchPostById(postId);
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        setError("Post not found");
      }
      setLoading(false);
    };

    if (postId) {
      loadPost();
    }
  }, [postId, fetchPostById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-reddit-bg text-reddit-text">
        <div className="animate-pulse">Loading post...</div>
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
      </div>
    </div>
  );
};

export default PostDetail;
