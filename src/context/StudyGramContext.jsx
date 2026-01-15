import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { mockQuizzes } from "../data/quizData";
import {
  signup as apiSignup,
  login as apiLogin,
  logout as apiLogout,
  sync as apiSync,
} from "../api/auth";
import { getProfile, updateProfile } from "../api/profile";
import { supabase } from "../utils/supabase";
import {
  createPost as apiCreatePost,
  getPosts as apiGetPosts,
  getUserPosts as apiGetUserPosts,
  getPost as apiGetPost,
  likePost as apiLikePost,
  unlikePost as apiUnlikePost,
  createComment as apiCreateComment,
  getComments as apiGetComments,
  bookmarkPost as apiBookmarkPost,
  unbookmarkPost as apiUnbookmarkPost,
  getBookmarks as apiGetBookmarks,
} from "../api/contents";
import { toast } from "sonner";

import { useLumelyReport } from "lumely-react";

const StudyGramContext = createContext();

export const useStudyGram = () => {
  const context = useContext(StudyGramContext);
  if (!context) {
    throw new Error("useStudyGram must be used within StudyGramProvider");
  }
  return context;
};

export const StudyGramProvider = ({ children }) => {
  const { reportError } = useLumelyReport();
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Posts & Comments State
  const [posts, setPosts] = useState([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);
  const [comments, setComments] = useState({});

  // Quiz State
  const [quizzes, setQuizzes] = useState(mockQuizzes);

  // UI State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(null);

  // Action Replay State
  const [pendingAction, setPendingAction] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Mobile State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize - Check for session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("studly_token");
        if (token) {
          try {
            const userProfile = await getProfile();
            if (userProfile) {
              setIsAuthenticated(true);

              setCurrentUser({
                ...userProfile,
                avatar: userProfile.avatar || null
              });
              return;
            }
          } catch (err) {
            console.log("Session validation failed:", err.message);
            reportError(err);
            // If token is invalid, clear it
            localStorage.removeItem("studly_token");
            localStorage.removeItem("studly_refresh_token");
          }
        }
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Map backend post to frontend format
  const mapBackendPostToFrontend = useCallback(
    (post) => {
      const images = Array.isArray(post.post_media)
        ? post.post_media
          .filter((url) => url !== "placeholder")
          .map((url) => ({ url: url, alt: "Post Image" }))
        : [];

      const postUser = {
        id: post.creator_id,
        username: post.creator_username || `user${post.creator_id}`,
        displayName:
          post.creator_name ||
          post.creator_username ||
          `User ${post.creator_id}`,
        avatar:
          post.creator_avatar || null,
      };

      let timestamp = new Date().toISOString();
      if (post.post_created_at) {
        timestamp = post.post_created_at.replace(" ", "T");
        if (!timestamp.endsWith("Z") && !timestamp.includes("+")) {
          timestamp += "Z";
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
          post.post_is_liked_by_requester && currentUser
            ? [currentUser.id]
            : [],
        bookmarkedBy:
          post.post_is_bookmarked_by_requester && currentUser
            ? [currentUser.id]
            : [],
        tags: post.post_hashtags || [],
        images: images,
        user: postUser,
      };
    },
    [currentUser]
  );

  // Fetch Feed Posts
  const fetchFeedPosts = useCallback(async () => {
    setIsFeedLoading(true);
    try {
      const serverPosts = await apiGetPosts();
      const mappedPosts = (serverPosts || []).map(mapBackendPostToFrontend);
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch feed posts:", error);
      reportError(error);

      // Check for specific "User record not found" error which implies invalid auth state
      if (error.response?.status === 401 && error.response?.data?.error === "User record not found") {
        console.warn("User record missing on backend. Logging out.");
        logout();
      }
    } finally {
      setIsFeedLoading(false);
    }
  }, [mapBackendPostToFrontend]);

  const fetchUserPosts = useCallback(
    async (username) => {
      try {
        const serverPosts = await apiGetUserPosts(username);
        return serverPosts.map(mapBackendPostToFrontend);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
        reportError(error);
        return [];
      }
    },
    [mapBackendPostToFrontend]
  );

  const fetchPostById = useCallback(
    async (postId) => {
      try {
        // First, check if the post is already in the local state
        // Use String comparison to handle both UUIDs and numeric IDs
        const existingPost = posts.find((p) => String(p.id) === String(postId));
        if (existingPost) return existingPost;

        // Try to fetch the single post (works only for authenticated users)
        try {
          const serverPost = await apiGetPost(postId);
          if (serverPost) {
            return mapBackendPostToFrontend(serverPost);
          }
        } catch (singlePostError) {
          // If we get a 401 or any error, fall back to fetching from the public feed
          console.log("Single post API failed, fetching from public feed...", singlePostError.message);
          const allPosts = await apiGetPosts();
          const targetPost = allPosts.find((p) => String(p.post_id) === String(postId));
          if (targetPost) {
            return mapBackendPostToFrontend(targetPost);
          }
        }
        return null;
      } catch (error) {
        console.error("Failed to fetch post:", error);
        reportError(error);
        return null;
      }
    },
    [posts, mapBackendPostToFrontend]
  );

  // Optimistic UI Updates
  const updatePostInState = (postId, newContent) => {
    setPosts(prevPosts => prevPosts.map(post =>
      String(post.id) === String(postId)
        ? { ...post, content: newContent }
        : post
    ));
    // Also update selectedPost if it matches
    if (selectedPost && String(selectedPost.id) === String(postId)) {
      setSelectedPost(prev => ({ ...prev, content: newContent }));
    }
    setBookmarkedPosts(prev => prev.map(p => String(p.id) === String(postId) ? { ...p, content: newContent } : p));
  };

  const deletePostFromState = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => String(post.id) !== String(postId)));
    if (selectedPost && String(selectedPost.id) === String(postId)) {
      setSelectedPost(null);
    }
    setBookmarkedPosts(prev => prev.filter(p => String(p.id) !== String(postId)));
  };

  const updateCommentInState = (postId, commentId, newContent) => {
    setComments(prevComments => {
      const postComments = prevComments[postId];
      if (!postComments) return prevComments;

      const updateInTree = (list) => {
        return list.map(comment => {
          if (String(comment.id) === String(commentId)) {
            return { ...comment, content: newContent };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateInTree(comment.replies) };
          }
          return comment;
        });
      };

      return {
        ...prevComments,
        [postId]: updateInTree(postComments)
      };
    });
  };

  const deleteCommentFromState = (postId, commentId) => {
    setComments(prevComments => {
      const postComments = prevComments[postId];
      if (!postComments) return prevComments;

      const deleteFromTree = (list) => {
        return list.filter(comment => String(comment.id) !== String(commentId))
          .map(comment => {
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: deleteFromTree(comment.replies) };
            }
            return comment;
          });
      };

      return {
        ...prevComments,
        [postId]: deleteFromTree(postComments)
      };
    });
  };

  const fetchBookmarks = useCallback(async () => {
    setIsBookmarksLoading(true);
    try {
      const serverBookmarks = await apiGetBookmarks();
      const mappedBookmarks = serverBookmarks.map(mapBackendPostToFrontend);
      setBookmarkedPosts(mappedBookmarks);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      reportError(error);
    } finally {
      setIsBookmarksLoading(false);
    }
  }, [mapBackendPostToFrontend]);

  useEffect(() => {
    fetchFeedPosts();
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, fetchFeedPosts, fetchBookmarks]);

  // Auth Functions
  const login = useCallback(
    async (email, password) => {
      try {
        const data = await apiLogin(email, password);
        // Store tokens if present in response
        if (data.token) localStorage.setItem("studly_token", data.token);
        if (data.refresh_token) localStorage.setItem("studly_refresh_token", data.refresh_token);

        const userProfile = await getProfile();
        const user = userProfile ? {
          ...userProfile,
          avatar: userProfile.avatar || null
        } : {
          ...data.user,
          email: email,
          avatar: data.user?.avatar || null
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        if (pendingAction) {
          setPendingAction(null);
        }
        if (scrollPosition) {
          setTimeout(() => {
            window.scrollTo(0, scrollPosition);
          }, 100);
        }
        setShowAuthModal(false);
        return data;
      } catch (error) {
        console.error("Login failed context:", error);
        reportError(error);
        throw error;
      }
    },
    [pendingAction, scrollPosition]
  );

  const signup = useCallback(async (name, email, password) => {
    try {
      const data = await apiSignup(email, password, name);
      return data;
    } catch (error) {
      console.error("Signup failed:", error);
      reportError(error);
      throw error;
    }
  }, []);

  const syncWithBackend = useCallback(async (accessToken, refreshToken) => {
    try {
      const data = await apiSync(accessToken, refreshToken);
      if (data.token) localStorage.setItem("studly_token", data.token);
      if (data.refresh_token) localStorage.setItem("studly_refresh_token", data.refresh_token);

      const userProfile = await getProfile();

      setCurrentUser({
        ...userProfile,
        avatar: userProfile.avatar || null
      });
      setIsAuthenticated(true);
      setShowAuthModal(false);
      return true;
    } catch (error) {
      // If error is 409 (Conflict), it means user already exists/synced, which is fine
      if (error.response?.status === 409) {
        console.log("User already exists (sync conflict), proceeding as successful.");
        // We still need to set the user profile locally
        try {
          const userProfile = await getProfile();
          setCurrentUser({
            ...userProfile,
            avatar: userProfile.avatar || null
          });
          setIsAuthenticated(true);
          setShowAuthModal(false);
          return true;
        } catch (profileError) {
          console.error("Failed to fetch profile after sync conflict:", profileError);
          return false;
        }
      }

      console.error("Sync failed:", error);
      reportError(error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed on server:", error);
      reportError(error);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("studly_token");
    localStorage.removeItem("studly_refresh_token");
    await supabase.auth.signOut();
  }, []);

  const updateUser = useCallback(
    async (updatedData) => {
      try {
        if (!currentUser) return;
        const currentUsername = currentUser.username;
        const response = await updateProfile(currentUsername, updatedData);
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
        return response;
      } catch (error) {
        console.error("Update user failed:", error);
        reportError(error);
        throw error;
      }
    },
    [currentUser]
  );

  const requireAuth = useCallback(
    (action) => {
      if (!isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction(action);
        setShowAuthModal(true);
        return false;
      }
      return true;
    },
    [isAuthenticated]
  );

  // Post Functions
  const handleLikePost = useCallback(
    async (postId, skipAuth = false) => {
      if (!skipAuth && !isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction({ type: "like", postId });
        setShowAuthModal(true);
        return;
      }
      let previousPosts;
      setPosts((prevPosts) => {
        previousPosts = prevPosts;
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
      try {
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
        reportError(error);
        setPosts(previousPosts);
        toast.error("Failed to update like.");
      }
    },
    [posts, currentUser, isAuthenticated]
  );

  const handleBookmarkPost = useCallback(
    async (postId, post = null, skipAuth = false) => {
      if (!skipAuth && !isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction({ type: "bookmark", postId });
        setShowAuthModal(true);
        return;
      }

      const isAlreadyBookmarked = bookmarkedPosts.some((p) => p.id === postId);
      const previousBookmarks = bookmarkedPosts;
      let previousPosts;

      // Update feed posts if present
      setPosts((prevPosts) => {
        previousPosts = prevPosts;
        return prevPosts.map((p) => {
          if (p.id === postId) {
            const hasBookmarked = p.bookmarkedBy.includes(currentUser.id);
            return {
              ...p,
              bookmarkedBy: hasBookmarked
                ? p.bookmarkedBy.filter((id) => id !== currentUser.id)
                : [...p.bookmarkedBy, currentUser.id],
            };
          }
          return p;
        });
      });

      // Update bookmarks list synchronously
      if (isAlreadyBookmarked) {
        setBookmarkedPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        const postToAdd = posts.find((p) => p.id === postId) || post;
        if (postToAdd) {
          const newBookmark = {
            ...postToAdd,
            bookmarkedBy: [...(postToAdd.bookmarkedBy || []), currentUser.id],
          };
          setBookmarkedPosts((prev) => [newBookmark, ...prev]);
        }
      }

      try {
        if (isAlreadyBookmarked) {
          await apiUnbookmarkPost(postId);
          toast.success("Removed from bookmarks");
        } else {
          await apiBookmarkPost(postId);
          toast.success("Added to bookmarks");
        }
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
        reportError(error);
        setPosts(previousPosts);
        setBookmarkedPosts(previousBookmarks);
        toast.error("Failed to update bookmark.");
      }
    },
    [posts, currentUser, isAuthenticated, bookmarkedPosts]
  );

  const fetchCommentsForPost = useCallback(async (postId) => {
    try {
      const commentsData = await apiGetComments(postId);
      const formattedComments = commentsData.map((c) => ({
        id: c.comment_id,
        content: c.comment_content,
        timestamp: c.comment_created_at,
        likes: [],
        likeCount: c.comment_like_count,
        user: {
          id: c.commenter_user_id,
          username: c.commenter_username,
          name: c.commenter_name,
          avatar: c.commenter_avatar || null,
        },
        replies: [],
      }));
      setComments((prev) => ({ ...prev, [postId]: formattedComments }));
    } catch (error) {
      console.error("Failed to fetch comments", error);
      reportError(error);
    }
  }, []);

  const handleCommentClick = useCallback(
    (postId) => {
      setShowComments(postId);
      fetchCommentsForPost(postId);
    },
    [fetchCommentsForPost]
  );

  const handleCreatePost = useCallback(() => {
    if (!isAuthenticated) {
      setScrollPosition(window.scrollY);
      setPendingAction({ type: "create" });
      setShowAuthModal(true);
      return;
    }
    setShowCreatePostModal(true);
  }, [isAuthenticated]);

  const createPost = useCallback(
    async (postData) => {
      try {
        const payload = {
          content: postData.content,
          media: postData.media?.length > 0 ? postData.media : ["placeholder"],
        };
        const response = await apiCreatePost(payload);
        await fetchFeedPosts();
        setShowCreatePostModal(false);
        return response;
      } catch (error) {
        console.error("Failed to create post:", error);
        reportError(error);
        throw error;
      }
    },
    [fetchFeedPosts]
  );

  const handleLikeComment = useCallback(
    async (commentId, postId, skipAuth = false) => {
      if (!skipAuth && !isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction({ type: "like-comment", commentId, postId });
        setShowAuthModal(true);
        return;
      }
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
              likeCount: hasLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            };
          }
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
        return { ...prevComments, [postId]: updatedComments };
      });
    },
    [currentUser, isAuthenticated]
  );

  const addComment = useCallback(
    async (postId, content, parentId = null) => {
      if (!isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction({ type: "comment", postId });
        setShowAuthModal(true);
        return;
      }
      try {
        await apiCreateComment(postId, content, currentUser.id, parentId);
        fetchCommentsForPost(postId);
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
        reportError(error);
        toast.error("Failed to post comment.");
        return false;
      }
    },
    [isAuthenticated, currentUser, fetchCommentsForPost]
  );

  // Quiz Functions
  const handleLikeQuiz = useCallback(
    (quizId, skipAuth = false) => {
      if (!skipAuth && !isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction({ type: "like-quiz", quizId });
        setShowAuthModal(true);
        return;
      }
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
    },
    [currentUser, isAuthenticated]
  );

  const handleSaveQuiz = useCallback(
    (quizId, skipAuth = false) => {
      if (!skipAuth && !isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction({ type: "save-quiz", quizId });
        setShowAuthModal(true);
        return;
      }
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
    },
    [currentUser, isAuthenticated]
  );

  // Get feed posts with user data
  const feedPosts = useMemo(
    () =>
      posts
        .map((post) => ({
          ...post,
          user: post.user,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [posts]
  );

  const getCommentsForPostSelector = useCallback(
    (postId) => comments[postId] || [],
    [comments]
  );

  const value = useMemo(
    () => ({
      // Auth
      isAuthenticated,
      isAuthLoading,
      currentUser,
      login,
      signup,
      logout,
      updateUser,
      requireAuth,
      syncWithBackend,
      // Posts
      posts: feedPosts,
      isFeedLoading,
      bookmarkedPosts,
      isBookmarksLoading,
      handleLikePost,
      handleBookmarkPost,
      handleCommentClick,
      handleCreatePost,
      createPost,
      fetchPostById,
      fetchBookmarks,
      fetchUserPosts,
      // Comments
      comments,
      addComment,
      fetchCommentsForPost,
      handleLikeComment,
      getCommentsForPost: getCommentsForPostSelector,
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
    }),
    [
      isAuthenticated,
      isAuthLoading,
      currentUser,
      login,
      signup,
      logout,
      updateUser,
      requireAuth,
      syncWithBackend,
      feedPosts,
      isFeedLoading,
      bookmarkedPosts,
      isBookmarksLoading,
      handleLikePost,
      handleBookmarkPost,
      handleCommentClick,
      handleCreatePost,
      createPost,
      fetchPostById,
      fetchBookmarks,
      fetchUserPosts,
      comments,
      addComment,
      fetchCommentsForPost,
      handleLikeComment,
      getCommentsForPostSelector,
      updatePostInState,
      deletePostFromState,
      updateCommentInState,
      deleteCommentFromState,
      quizzes,
      handleLikeQuiz,
      handleSaveQuiz,
      showAuthModal,
      showCreatePostModal,
      selectedPost,
      showComments,
      isMobileMenuOpen,
    ]
  );

  return (
    <StudyGramContext.Provider value={value}>
      {children}
    </StudyGramContext.Provider>
  );
};
