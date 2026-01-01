import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  User,
} from "lucide-react";
import { useStudyGram } from "../context/StudyGramContext";
import Comment from "../components/comments/Comment";
import LoadingSpinner from "../components/common/LoadingSpinner";

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    handleLikePost,
    handleBookmarkPost,
    getCommentsForPost,
    addComment,
    isAuthenticated,
    setShowAuthModal,
    fetchPostById,
  } = useStudyGram();

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadPost = async () => {
      setLoading(true);
      try {
        const foundPost = await fetchPostById(postId);
        if (isMounted) {
          setPost(foundPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, fetchPostById]);

  const comments = getCommentsForPost ? getCommentsForPost(Number(postId)) : [];
  const isLiked = currentUser && post?.likes?.includes(currentUser.id);
  const isBookmarked =
    currentUser && post?.bookmarkedBy?.includes(currentUser.id);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setShowAuthModal(true);
    if (!commentText.trim()) return;

    addComment(post.id, commentText, replyingTo?.id);
    setCommentText("");
    setReplyingTo(null);
  };

  const handleFormatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return (
<<<<<<< HEAD
        <div className="min-h-screen text-white">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-reddit-bg/95 backdrop-blur-md z-10 px-4 py-3 flex items-center gap-6 border-b border-reddit-border">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-bold text-xl">Post</h1>
            </div>

            {/* Main Post Content */}
            <article className="px-4 pt-3 pb-2 border-b border-gray-800">
                {/* User Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${post.userId}`)}>
                        <img
                            src={post.user.avatar}
                            alt={post.user.displayName}
                            className="w-10 h-10 rounded-full bg-gray-700"
                        />
                        <div className="flex flex-col leading-snug">
                            <span className="font-bold hover:underline">{post.user.displayName}</span>
                            <span className="text-gray-500 text-sm">@{post.user.username}</span>
                        </div>
                    </div>
                    <button className="text-gray-500 hover:text-white p-2 rounded-full hover:bg-gray-800/50">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Post Text */}
                <div className="mb-4 text-[17px] leading-normal whitespace-pre-wrap">
                    {post.content}
                </div>

                {/* Start / Images (if any) */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-gray-800">
                        <img src={post.images[0].url} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
                    </div>
                )}

                {/* Metadata */}
                <div className="py-4 text-gray-500 text-[15px] border-b border-gray-800">
                    <span className="hover:underline cursor-pointer">{handleFormatTimestamp(post.timestamp)}</span>
                    <span className="mx-1">·</span>
                    <span className="text-white font-bold">34K</span> <span className="mr-1">Views</span>
                </div>

                {/* Stats / Counts (Only if non-zero, mimicking X's detailed stat row if needed, but often X hides this here and shows below actions) */}
                {(post.likeCount > 0 || post.commentCount > 0) && (
                    <div className="py-3 text-gray-500 text-sm border-b border-gray-800 flex gap-4">
                        {post.likeCount > 0 && <div><span className="text-white font-bold">{post.likeCount}</span> Likes</div>}
                        {post.commentCount > 0 && <div><span className="text-white font-bold">{post.commentCount}</span> Quotes</div>}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-around py-2 border-b border-gray-800 mt-1">
                    <button
                        onClick={() => handleLikePost(post.id)}
                        className={`group flex items-center justify-center p-2 rounded-full transition-colors ${isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'}`}
                    >
                        <div className="p-2 rounded-full group-hover:bg-pink-600/10">
                            <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
                        </div>
                    </button>

                    <button
                        onClick={() => inputRef.current?.focus()}
                        className="group flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-500 transition-colors"
                    >
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                            <MessageCircle size={22} />
                        </div>
                    </button>

                    <button
                        onClick={() => handleBookmarkPost(post.id)}
                        className={`group flex items-center justify-center p-2 rounded-full transition-colors ${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
                    >
                        <div className="p-2 rounded-full group-hover:bg-yellow-500/10">
                            <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} />
                        </div>
                    </button>

                    <button className="group flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-500 transition-colors">
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                            <Share2 size={22} />
                        </div>
                    </button>
                </div>
            </article>

            {/* Reply Input */}
            <div className="px-4 py-4 border-b border-gray-800 flex gap-3">
                {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="User avatar" className="w-10 h-10 rounded-full bg-gray-700 object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex items-center justify-center">
                        <User size={20} className="text-reddit-textMuted" />
                    </div>
                )}
                <div className="flex-1">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Post your reply"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onClick={() => !isAuthenticated && setShowAuthModal(true)}
                            className="w-full bg-transparent text-xl placeholder-gray-500 text-white outline-none py-2"
                        />
                    </div>
                    {commentText && (
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleReplySubmit}
                                className="bg-reddit-orange text-white font-bold px-4 py-1.5 rounded-full hover:bg-reddit-orange/90 transition-colors"
                            >
                                Reply
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments List */}
            <div className="pb-20">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        postId={Number(postId)}
                        onReply={(c) => {
                            setReplyingTo(c);
                            setCommentText(`@${c.user.username} `);
                            inputRef.current?.focus();
                        }}
                    />
                ))}
                {comments.length === 0 && (
                    <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-2">
                        <MessageCircle size={32} className="opacity-50" />
                        <p>No comments yet. Be the first to reply!</p>
                    </div>
                )}
            </div>
        </div>
=======
      date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) +
      " · " +
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
>>>>>>> 4abfb234ef95f621c1dd7c6d3fea916a52df7ac1
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <LoadingSpinner size={60} color="#FF4500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <h2 className="text-xl font-bold mb-2">Post not found</h2>
        <p className="text-gray-500 mb-4">
          The post you are looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-reddit-orange px-4 py-2 rounded-full font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-reddit-bg/95 backdrop-blur-md z-10 px-4 py-3 flex items-center gap-6 border-b border-reddit-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-xl">Post</h1>
      </div>

      {/* Main Post Content */}
      <article className="px-4 pt-3 pb-2 border-b border-gray-800">
        {/* User Info */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/profile/${post.userId}`)}
          >
            <img
              src={post.user.avatar}
              alt={post.user.displayName}
              className="w-10 h-10 rounded-full bg-gray-700"
            />
            <div className="flex flex-col leading-snug">
              <span className="font-bold hover:underline">
                {post.user.displayName}
              </span>
              <span className="text-gray-500 text-sm">
                @{post.user.username}
              </span>
            </div>
          </div>
          <button className="text-gray-500 hover:text-white p-2 rounded-full hover:bg-gray-800/50">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Post Text */}
        <div className="mb-4 text-[17px] leading-normal whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Start / Images (if any) */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-gray-800">
            <img
              src={post.images[0].url}
              alt="Post content"
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Metadata */}
        <div className="py-4 text-gray-500 text-[15px] border-b border-gray-800">
          <span className="hover:underline cursor-pointer">
            {handleFormatTimestamp(post.timestamp)}
          </span>
          <span className="mx-1">·</span>
          <span className="text-white font-bold">34K</span>{" "}
          <span className="mr-1">Views</span>
        </div>

        {/* Stats / Counts (Only if non-zero, mimicking X's detailed stat row if needed, but often X hides this here and shows below actions) */}
        {(post.likeCount > 0 || post.commentCount > 0) && (
          <div className="py-3 text-gray-500 text-sm border-b border-gray-800 flex gap-4">
            {post.likeCount > 0 && (
              <div>
                <span className="text-white font-bold">{post.likeCount}</span>{" "}
                Likes
              </div>
            )}
            {post.commentCount > 0 && (
              <div>
                <span className="text-white font-bold">
                  {post.commentCount}
                </span>{" "}
                Quotes
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-around py-2 border-b border-gray-800 mt-1">
          <button
            onClick={() => handleLikePost(post.id)}
            className={`group flex items-center justify-center p-2 rounded-full transition-colors ${
              isLiked ? "text-pink-600" : "text-gray-500 hover:text-pink-600"
            }`}
          >
            <div className="p-2 rounded-full group-hover:bg-pink-600/10">
              <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
            </div>
          </button>

          <button
            onClick={() => inputRef.current?.focus()}
            className="group flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-500 transition-colors"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-500/10">
              <MessageCircle size={22} />
            </div>
          </button>

          <button
            onClick={() => handleBookmarkPost(post.id, post)}
            className={`group flex items-center justify-center p-2 rounded-full transition-colors ${
              isBookmarked
                ? "text-yellow-500"
                : "text-gray-500 hover:text-yellow-500"
            }`}
          >
            <div className="p-2 rounded-full group-hover:bg-yellow-500/10">
              <Bookmark
                size={22}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </div>
          </button>

          <button className="group flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-500 transition-colors">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10">
              <Share2 size={22} />
            </div>
          </button>
        </div>
      </article>

      {/* Reply Input */}
      <div className="px-4 py-4 border-b border-gray-800 flex gap-3">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full bg-gray-700 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex items-center justify-center">
            <User size={20} className="text-reddit-textMuted" />
          </div>
        )}
        <div className="flex-1">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Post your reply"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onClick={() => !isAuthenticated && setShowAuthModal(true)}
              className="w-full bg-transparent text-xl placeholder-gray-500 text-white outline-none py-2"
            />
          </div>
          {commentText && (
            <div className="flex justify-end mt-2">
              <button
                onClick={handleReplySubmit}
                className="bg-reddit-orange text-white font-bold px-4 py-1.5 rounded-full hover:bg-reddit-orange/90 transition-colors"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="pb-20">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={Number(postId)}
            onReply={(c) => {
              setReplyingTo(c);
              setCommentText(`@${c.user.username} `);
              inputRef.current?.focus();
            }}
          />
        ))}
        {comments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No comments yet. Be the first to reply!
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;
