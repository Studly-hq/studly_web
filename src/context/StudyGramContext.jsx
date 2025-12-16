import React, { createContext, useContext, useState, useEffect } from "react";
import {
  mockUsers,
  mockPosts,
  mockComments,
  getUserById,
} from "../data/studygramData";
import { mockQuizzes } from "../data/quizData";
import {
  signup as apiSignup,
  login as apiLogin,
  logout as apiLogout,
} from "../api/auth"; // Importing API functions
import { getProfile, updateProfile } from "../api/profile"; // Import profile service
import {
  createPost as apiCreatePost,
  getPosts as apiGetPosts,
  getPost as apiGetPost,
  likePost as apiLikePost,
  unlikePost as apiUnlikePost,
  createComment as apiCreateComment,
  getComments as apiGetComments,
  // likeComment as apiLikeComment,
  // unlikeComment as apiUnlikeComment,
} from "../api/contents"; // Import content service
import { toast } from "sonner";

const StudyGramContext = createContext();

export const useStudyGram = () => {
  const context = useContext(StudyGramContext);
  if (!context) {
    throw new Error("useStudyGram must be used within StudyGramProvider");
  }
  return context;
};

export const StudyGramProvider = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Posts & Comments State
  const [posts, setPosts] = useState([]); // Start empty, fetch real posts
  const [comments, setComments] = useState(mockComments);

  // Quiz State
  const [quizzes, setQuizzes] = useState(mockQuizzes);

  // UI State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(null); // postId when comments open

  // Action Replay State (for guest interactions)
  const [pendingAction, setPendingAction] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Mobile State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize - Check for session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Try to get profile from backend (this handles Google Login return where cookie/session is set)
        // If we have a session cookie, this will work.
        const userProfile = await getProfile();

        if (userProfile) {
          console.log("Session found:", userProfile);
          // Assuming userProfile is the user object, or has a 'user' property
          const user = userProfile.user || userProfile;

          setIsAuthenticated(true);
          setCurrentUser(user);
          localStorage.setItem("studly_auth", JSON.stringify({ user }));
          return;
        }
      } catch (err) {
        console.log("No active session found.");
        localStorage.removeItem("studly_auth");
      }

      /*
      const savedAuth = localStorage.getItem("studly_auth");
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setCurrentUser(authData.user);
      }
      */
    };

    checkAuth();
  }, []);

  // Placeholder images collection
  const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1513258496098-b1fcb478adcc?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558021284-836f886fbe5d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
  ];

  const mapBackendPostToFrontend = (post) => {
    // Handle images: backend returns array of strings (urls)
    // If "placeholder", treat as empty array (text post)
    const images = Array.isArray(post.post_media)
      ? post.post_media
          .filter((url) => url !== "placeholder") // Filter out "placeholder"
          .map((url) => ({
            url: url,
            alt: "Post Image",
          }))
      : [];

    // Handle User from Creator fields
    const postUser = {
      id: post.creator_id,
      username: post.creator_username || `user${post.creator_id}`,
      displayName:
        post.creator_name || post.creator_username || `User ${post.creator_id}`,
      avatar:
        post.creator_avatar || `https://i.pravatar.cc/150?u=${post.creator_id}`,
    };

    // Handle Timestamp
    let timestamp = new Date().toISOString();
    if (post.post_created_at) {
      timestamp = post.post_created_at.replace(" ", "T");
      if (!timestamp.endsWith("Z") && !timestamp.includes("+")) {
        timestamp += "Z"; // Assume UTC
      }
    }

    return {
      id: post.post_id,
      type:
        images.length > 0
          ? images.length > 1
            ? "carousel"
            : "single-image"
          : "text",
      content: post.post_content || "",
      timestamp: timestamp,
      likeCount: post.post_like_count || 0,
      commentCount: post.post_comment_count || 0,
      userId: post.creator_id,
      likes:
        post.post_is_liked_by_requester && currentUser ? [currentUser.id] : [],
      bookmarkedBy:
        post.post_is_bookmarked_by_requester && currentUser
          ? [currentUser.id]
          : [],
      tags: post.post_hashtags || [],
      images: images,
      user: postUser,
    };
  };

  // Fetch Feed Posts
  const fetchFeedPosts = async () => {
    try {
      const serverPosts = await apiGetPosts();
      const mappedPosts = serverPosts.map(mapBackendPostToFrontend);
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch feed posts:", error);
      // Fallback to mock posts if fetch fails? Or just show empty/error?
      // setPosts(mockPosts);
    }
  };

  // Fetch Single Post
  const fetchPostById = async (postId) => {
    try {
      // Check local state first
      const existingPost = posts.find((p) => p.id === parseInt(postId));
      if (existingPost) return existingPost;

      // Fetch from API
      const serverPost = await apiGetPost(postId);
      if (serverPost) {
        return mapBackendPostToFrontend(serverPost);
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch post:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchFeedPosts();
  }, [isAuthenticated]); // Re-fetch when auth status changes (e.g. login)

  // Auth Functions
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);

      // Assuming data contains user info. If it contains a token, store it.
      // For now, let's log what we get to ensure we structure it right.
      console.log("Login successful, data:", data);

      // If the backend returns a user object directly or nested:
      // Adjust this based on actual response structure.
      // Falling back to mock-like structure if needed but using returned data properties.
      const user = {
        ...mockUsers.currentUser, // Fallback for missing fields like 'avatar'
        ...data.user, // Overwrite with real data if exists
        email: email, // Ensure email is correct
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("studly_auth", JSON.stringify({ user }));

      // Replay pending action if exists
      if (pendingAction) {
        replayAction(pendingAction);
        setPendingAction(null);
      }

      // Restore scroll position
      if (scrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, scrollPosition);
        }, 100);
      }

      setShowAuthModal(false);
      return data;
    } catch (error) {
      console.error("Login failed context:", error);
      throw error;
    }
  };

  /*
   * Signup Function
   * Changed to use the real API 'apiSignup' we imported.
   */
  const signup = async (name, email, password) => {
    try {
      // 1. Signup
      await apiSignup(email, password);

      // 2. Auto-login removed per user request.
      // User must login manually after signup.
      // await login(email, password);

      return true;
    } catch (error) {
      console.error("Signup/Auto-login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call API to destroy session on server
      await apiLogout();
    } catch (error) {
      console.error("Logout failed on server:", error);
    }

    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("studly_auth");
  };

  const updateUser = async (updatedData) => {
    try {
      // We need the current username to identify which user to update
      // (as per the API requirement: ?username=...)
      const currentUsername = currentUser.username;

      const response = await updateProfile(currentUsername, updatedData);

      // Update local state with the new data
      // We merge existing user data with the updates
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      localStorage.setItem(
        "studly_auth",
        JSON.stringify({ user: updatedUser })
      );

      return response;
    } catch (error) {
      console.error("Update user failed:", error);
      throw error;
    }
  };

  // Action Replay System
  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setScrollPosition(window.scrollY);
      setPendingAction(action);
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const replayAction = (action) => {
    switch (action.type) {
      case "like":
        handleLikePost(action.postId, true);
        break;
      case "comment":
        setShowComments(action.postId);
        break;
      case "bookmark":
        handleBookmarkPost(action.postId, true);
        break;
      case "create":
        setShowCreatePostModal(true);
        break;
      case "like-comment":
        handleLikeComment(action.commentId, action.postId, true);
        break;
      default:
        break;
    }
  };

  // Post Functions
  const handleLikePost = async (postId, skipAuth = false) => {
    if (!skipAuth && !requireAuth({ type: "like", postId })) return;

    // 1. Optimistic Update
    let previousPosts;
    setPosts((prevPosts) => {
      previousPosts = prevPosts; // Save for rollback
      return prevPosts.map((post) => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(currentUser.id);
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter((id) => id !== currentUser.id)
              : [...post.likes, currentUser.id],
            likeCount: hasLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      });
    });

    // 2. Call API
    try {
      const post = posts.find((p) => p.id === postId);
      const isLiking = !post.likes.includes(currentUser.id); // Check *current* state before update implied we toggled.
      // ERROR: `posts` here is stale closure. We need to find the post from the *previous* state or determining action differently.
      // Better way: Check if text 'like' or 'unlike' based on the optimistic update logic.

      // Actually, easier to check what we *would* do.
      const currentPost = posts.find((p) => p.id === postId);
      if (!currentPost) return;
      const alreadyLiked = currentPost.likes.includes(currentUser.id);

      if (alreadyLiked) {
        await apiUnlikePost(postId);
      } else {
        await apiLikePost(postId);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert
      setPosts(previousPosts);
      toast.error("Failed to update like.");
    }
  };

  const handleBookmarkPost = (postId, skipAuth = false) => {
    if (!skipAuth && !requireAuth({ type: "bookmark", postId })) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const hasBookmarked = post.bookmarkedBy.includes(currentUser.id);
          return {
            ...post,
            bookmarkedBy: hasBookmarked
              ? post.bookmarkedBy.filter((id) => id !== currentUser.id)
              : [...post.bookmarkedBy, currentUser.id],
          };
        }
        return post;
      })
    );
  };

  const handleCommentClick = (postId) => {
    // if (!requireAuth({ type: "comment", postId })) return; // Comments can be viewed by guests? Maybe.
    setShowComments(postId);
    fetchCommentsForPost(postId);
  };

  const handleCreatePost = () => {
    if (!requireAuth({ type: "create" })) return;
    setShowCreatePostModal(true);
  };

  const createPost = async (postData) => {
    try {
      // Prepare payload for API
      // API expects { content, media }
      // We will default media to an empty array or the placeholder if not provided,
      // closely matching the curl example which expects the field to exist.

      const media = postData.images ? postData.images.map((i) => i.url) : []; // Send undefined to omit field from JSON

      const payload = {
        content: postData.content,
        media: postData.media?.length > 0 ? postData.media : ["placeholder"],
      };

      const response = await apiCreatePost(payload);

      console.log("Create Post Response:", response);

      const newPost = {
        ...response,
        user: currentUser,
        // Ensure defaults if backend omits them
        likes: response.likes || [],
        likeCount: response.likeCount || 0,
        commentCount: response.commentCount || 0,
        bookmarkedBy: response.bookmarkedBy || [],
        timestamp: response.timestamp || new Date().toISOString(),
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setShowCreatePostModal(false);
      return newPost;
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  };

  // Comment Functions
  const handleLikeComment = async (commentId, postId, skipAuth = false) => {
    if (!skipAuth && !requireAuth({ type: "like-comment", commentId, postId }))
      return;

    // 1. Optimistic Update
    let previousComments;
    setComments((prevComments) => {
      previousComments = prevComments; // Save for rollback
      const postComments = prevComments[postId] || [];
      const updatedComments = postComments.map((comment) => {
        // Check if it's the main comment being liked/unliked
        if (comment.id === commentId) {
          const hasLiked = comment.likes.includes(currentUser.id);
          return {
            ...comment,
            likes: hasLiked
              ? comment.likes.filter((id) => id !== currentUser.id)
              : [...comment.likes, currentUser.id],
            likeCount: hasLiked ? comment.likeCount - 1 : comment.likeCount + 1,
          };
        }

        // Check replies if the commentId matches a reply
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                const hasLiked = reply.likes.includes(currentUser.id);
                return {
                  ...reply,
                  likes: hasLiked
                    ? reply.likes.filter((id) => id !== currentUser.id)
                    : [...reply.likes, currentUser.id],
                  likeCount: hasLiked
                    ? reply.likeCount - 1
                    : reply.likeCount + 1,
                };
              }
              return reply;
            }),
          };
        }

        return comment;
      });

      return {
        ...prevComments,
        [postId]: updatedComments,
      };
    });
  };

  const addComment = async (postId, content, parentId = null) => {
    if (!requireAuth({ type: "comment", postId })) return;

    // Optimistic Update (Optional) or Wait for API
    // Let's await API for consistency with backend IDs
    try {
      const newComment = await apiCreateComment(
        postId,
        content,
        currentUser.id,
        parentId
      );

      setComments((prev) => {
        const postComments = prev[postId] || [];
        // Map backend response to frontend structure if needed, or assume backend matches
        // The endpoint returns "Comment created successfully" or the object?
        // Docs say "Comment created successfully" (201).
        // We might need to refetch or manually construct the comment object if backend doesn't return it.
        // Waiting for clarification or assuming we need to fetch.
        // Let's assume we need to REFETCH for now to get the full comment object with clean ID/timestamp.
        return prev;
      });

      // Refetch comments to get the new one
      fetchCommentsForPost(postId);

      // Update comment count on post
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        )
      );

      return true;
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to post comment.");
      return false;
    }
  };

  const fetchCommentsForPost = async (postId) => {
    try {
      const commentsData = await apiGetComments(postId);
      // Transform if necessary (snake_case to camelCase)
      const formattedComments = commentsData.map((c) => ({
        id: c.comment_id,
        content: c.comment_content,
        timestamp: c.comment_created_at, // timestamps logic
        // Backend returns count, but frontend expects array of IDs for .includes().
        // We set likes to [] to prevent crash, and use likeCount for display.
        likes: [],
        likeCount: c.comment_like_count,
        user: {
          id: c.commenter_user_id,
          username: c.commenter_username,
          name: c.commenter_name,
          avatar: c.commenter_avatar,
        },
        replies: [], // sub_comment_count handled separately?
      }));

      setComments((prev) => ({
        ...prev,
        [postId]: formattedComments,
      }));
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  // Quiz Functions
  const handleLikeQuiz = (quizId, skipAuth = false) => {
    if (!skipAuth && !requireAuth({ type: "like-quiz", quizId })) return;

    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) => {
        if (quiz.id === quizId) {
          const hasLiked = quiz.likes.includes(currentUser.id);
          return {
            ...quiz,
            likes: hasLiked
              ? quiz.likes.filter((id) => id !== currentUser.id)
              : [...quiz.likes, currentUser.id],
            likeCount: hasLiked ? quiz.likeCount - 1 : quiz.likeCount + 1,
          };
        }
        return quiz;
      })
    );
  };

  const handleSaveQuiz = (quizId, skipAuth = false) => {
    if (!skipAuth && !requireAuth({ type: "save-quiz", quizId })) return;

    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) => {
        if (quiz.id === quizId) {
          const hasSaved = quiz.savedBy.includes(currentUser.id);
          return {
            ...quiz,
            savedBy: hasSaved
              ? quiz.savedBy.filter((id) => id !== currentUser.id)
              : [...quiz.savedBy, currentUser.id],
          };
        }
        return quiz;
      })
    );
  };

  // Get feed posts with user data
  const feedPosts = posts
    .map((post) => ({
      ...post,
      user: getUserById(post.userId) || post.user,
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const value = {
    // Auth
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
    updateUser,
    requireAuth,

    // Posts
    posts: feedPosts,
    handleLikePost,
    handleBookmarkPost,
    handleCommentClick,
    handleCreatePost,
    createPost,
    fetchPostById, // Add fetchPostById here

    // Comments
    comments,
    addComment,
    fetchCommentsForPost,
    handleLikeComment,
    getCommentsForPost: (postId) => comments[postId] || [],

    // Quizzes
    quizzes,
    handleLikeQuiz,
    handleSaveQuiz,

    // UI State
    showAuthModal,
    setShowAuthModal,
    showCreatePostModal,
    setShowCreatePostModal,
    selectedPost,
    setSelectedPost,
    showComments,
    setShowComments,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };

  return (
    <StudyGramContext.Provider value={value}>
      {children}
    </StudyGramContext.Provider>
  );
};
