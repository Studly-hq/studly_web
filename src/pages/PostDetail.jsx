import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, User } from "lucide-react";
import PostCard from "../components/post/PostCard";
import Comment from "../components/comments/Comment";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { PostCardSkeleton, CommentsSkeleton } from "../components/common/Skeleton";
import { useAuth } from "../context/AuthContext";
import { useFeed } from "../context/FeedContext";
import { useUI } from "../context/UIContext";
import { usePersistentState } from "../hooks/usePersistentState";

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
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which postId we've loaded to prevent double-loading
  const loadedPostIdRef = useRef(null);

  // Comment State
  const [commentText, setCommentText] = usePersistentState(`draft_comment_${postId || 'new'}`, "");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [visibleComments, setVisibleComments] = usePersistentState(`prev_visible_comments_${postId || 'new'}`, 5);
  const comments = getCommentsForPost(postId);

  useEffect(() => {
    const loadPost = async () => {
      // Check if we already have this post in global state
      const existingPost = posts.find(p => String(p.id) === String(postId));

      if (existingPost) {
        setPost(existingPost);
        // We can skip initial "heavy" loading if we have the post
        if (loadedPostIdRef.current !== postId) {
          // But we still want to fetch fresh comments in the background
          setCommentsLoading(true);
          await fetchCommentsForPost(postId);
          setCommentsLoading(false);
          loadedPostIdRef.current = postId;
        }
        setLoading(false);
      } else {
        // Only show full-page loading skeleton if we don't have the post at all
        if (loadedPostIdRef.current !== postId) {
          setLoading(true);
          setCommentsLoading(true);
          loadedPostIdRef.current = postId;

          const fetchedPost = await fetchPostById(postId);
          if (fetchedPost) {
            setPost(fetchedPost);
            await fetchCommentsForPost(postId);
            setCommentsLoading(false);
          } else {
            setError("Post not found, Please try again!");
          }
          setLoading(false);
        }
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, posts, fetchPostById, fetchCommentsForPost]);

  // Update SEO/Social preview tags
  useEffect(() => {
    if (post) {
      // Dynamic Title
      const postTitle = post.content ?
        `${post.content.substring(0, 60)}${post.content.length > 60 ? '...' : ''} | Studly` :
        'Post Details | Studly';
      document.title = postTitle;

      // Meta Tags for Social Preview
      const updateMetaTag = (attribute, value, content) => {
        let tag = document.querySelector(`meta[${attribute}="${value}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute(attribute, value);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      const siteUrl = window.location.origin;
      const currentUrl = window.location.href;
      const postDescription = post.content?.substring(0, 160) || 'Check out this post on Studly!';
      const postImage = post.images && post.images.length > 0
        ? post.images[0].url
        : `${siteUrl}/logo.png`;

      // Open Graph
      updateMetaTag('property', 'og:title', postTitle);
      updateMetaTag('property', 'og:description', postDescription);
      updateMetaTag('property', 'og:image', postImage);
      updateMetaTag('property', 'og:url', currentUrl);
      updateMetaTag('property', 'og:type', 'article');
      updateMetaTag('property', 'og:site_name', 'Studly');

      // Twitter
      updateMetaTag('name', 'twitter:card', post.images?.length > 0 ? 'summary_large_image' : 'summary');
      updateMetaTag('name', 'twitter:title', postTitle);
      updateMetaTag('name', 'twitter:description', postDescription);
      updateMetaTag('name', 'twitter:image', postImage);

      return () => {
        document.title = 'Studly | Interactive E-Learning Platform';
      };
    }
  }, [post]);



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
      <div className="min-h-screen bg-reddit-bg">
        {/* Header skeleton */}
        <div className="sticky top-0 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
          <div className="max-w-[640px] mx-auto px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-reddit-cardHover animate-pulse" />
            <div className="w-24 h-5 bg-reddit-cardHover rounded animate-pulse" />
          </div>
        </div>

        {/* Post skeleton */}
        <div className="max-w-[640px] mx-auto px-4 py-5">
          <PostCardSkeleton />

          {/* Comments section skeleton */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-reddit-cardHover rounded animate-pulse" />
              <div className="w-24 h-4 bg-reddit-cardHover rounded animate-pulse" />
            </div>
            <CommentsSkeleton count={3} />
          </div>
        </div>
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
                {commentsLoading ? (
                  <span className="inline-block w-6 h-4 bg-reddit-cardHover rounded animate-pulse" />
                ) : (
                  `(${comments.length})`
                )}
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
              <>
                {comments.slice(0, visibleComments).map((comment) => (
                  <div key={comment.id}>
                    <Comment
                      comment={comment}
                      postId={postId}
                      onCommentUpdated={(commentId, content) => updateCommentInState(postId, commentId, content)}
                      onCommentDeleted={(commentId) => deleteCommentFromState(postId, commentId)}
                    />
                  </div>
                ))}

                {visibleComments < comments.length && (
                  <button
                    onClick={() => setVisibleComments(prev => prev + 5)}
                    className="w-full py-2 text-sm text-reddit-orange font-semibold hover:bg-reddit-orange/10 rounded-lg transition-colors mt-2"
                  >
                    Load more comments ({comments.length - visibleComments} remaining)
                  </button>
                )}
              </>
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
