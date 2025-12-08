import React, { createContext, useContext, useState, useEffect } from "react";
import {
  mockUsers,
  mockPosts,
  mockComments,
  getFeedPosts,
  getCommentsForPost,
  getUserById,
} from "../data/studygramData";
import { mockQuizzes } from "../data/quizData";
import {
  signup as apiSignup,
  login as apiLogin,
  logout as apiLogout,
} from "../api/auth"; // Importing API functions
import { getProfile } from "../api/profile"; // Import profile service

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
  const [posts, setPosts] = useState(mockPosts);
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
        // If profile fetch fails (401), we are not logged in.
        // Fallback: Check localStorage just in case we are offline or something,
        // but for security, usually API is source of truth.
        // For now, if API fails, we clear localStorage to stay in sync.
        console.log("No active session found.");
        localStorage.removeItem("studly_auth");
      }

      // Old localStorage check (fallback or if we want to keep user logged in optimistically)
      // For now, let's rely on the API check above primarily.
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
  const handleLikePost = (postId, skipAuth = false) => {
    if (!skipAuth && !requireAuth({ type: "like", postId })) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
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
      })
    );
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
    if (!requireAuth({ type: "comment", postId })) return;
    setShowComments(postId);
  };

  const handleCreatePost = () => {
    if (!requireAuth({ type: "create" })) return;
    setShowCreatePostModal(true);
  };

  const createPost = (postData) => {
    const newPost = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      likes: [],
      likeCount: 0,
      commentCount: 0,
      bookmarkedBy: [],
      ...postData,
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowCreatePostModal(false);
  };

  // Comment Functions
  const handleLikeComment = (commentId, postId, skipAuth = false) => {
    if (!skipAuth && !requireAuth({ type: "like-comment", commentId, postId }))
      return;

    setComments((prevComments) => {
      const postComments = prevComments[postId] || [];
      const updatedComments = postComments.map((comment) => {
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

        // Check replies
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

  const addComment = (postId, content, parentId = null) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      parentId,
      userId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      likes: [],
      likeCount: 0,
      replies: [],
    };

    setComments((prevComments) => {
      const postComments = prevComments[postId] || [];

      if (parentId) {
        // Add as reply
        const updatedComments = postComments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        });
        return {
          ...prevComments,
          [postId]: updatedComments,
        };
      } else {
        // Add as top-level comment
        return {
          ...prevComments,
          [postId]: [...postComments, newComment],
        };
      }
    });

    // Update comment count on post
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount + 1 }
          : post
      )
    );
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
      user: getUserById(post.userId),
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const value = {
    // Auth
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
    requireAuth,

    // Posts
    posts: feedPosts,
    handleLikePost,
    handleBookmarkPost,
    handleCommentClick,
    handleCreatePost,
    createPost,

    // Comments
    comments,
    addComment,
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
