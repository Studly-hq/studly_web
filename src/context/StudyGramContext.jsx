import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { mockUsers, mockComments, getUserById } from "../data/studygramData";
import { mockQuizzes } from "../data/quizData";
import {
  signup as apiSignup,
  login as apiLogin,
  logout as apiLogout,
} from "../api/auth";
import { getProfile, updateProfile } from "../api/profile";
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Posts & Comments State
  const [posts, setPosts] = useState([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);
  const [comments, setComments] = useState(mockComments);

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
        try {
          const userProfile = await getProfile();
          if (userProfile) {
            setIsAuthenticated(true);
            setCurrentUser(userProfile);
            localStorage.setItem(
              "studly_auth",
              JSON.stringify({ user: userProfile })
            );
            return;
          }
        } catch (err) {
          console.log("Session validation failed:", err.message);
        }
        const savedAuth = localStorage.getItem("studly_auth");
        if (savedAuth) {
          try {
            JSON.parse(savedAuth);
            localStorage.removeItem("studly_auth");
          } catch (parseErr) {
            localStorage.removeItem("studly_auth");
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
          post.creator_avatar ||
          `https://i.pravatar.cc/150?u=${post.creator_id}`,
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
      const mappedPosts = serverPosts.map(mapBackendPostToFrontend);
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch feed posts:", error);
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
        return [];
      }
    },
    [mapBackendPostToFrontend]
  );

  const fetchPostById = useCallback(
    async (postId) => {
      try {
        const existingPost = posts.find((p) => p.id === parseInt(postId));
        if (existingPost) return existingPost;
        const serverPost = await apiGetPost(postId);
        if (serverPost) {
          return mapBackendPostToFrontend(serverPost);
        }
        return null;
      } catch (error) {
        console.error("Failed to fetch post:", error);
        return null;
      }
    },
    [posts, mapBackendPostToFrontend]
  );

  const fetchBookmarks = useCallback(async () => {
    setIsBookmarksLoading(true);
    try {
      const serverBookmarks = await apiGetBookmarks();
      const mappedBookmarks = serverBookmarks.map(mapBackendPostToFrontend);
      setBookmarkedPosts(mappedBookmarks);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
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
        const userProfile = await getProfile();
        const user = userProfile || {
          ...mockUsers.currentUser,
          ...data.user,
          email: email,
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("studly_auth", JSON.stringify({ user }));
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
        throw error;
      }
    },
    [pendingAction, scrollPosition]
  );

  const signup = useCallback(async (name, email, password) => {
    try {
      await apiSignup(email, password);
      return true;
    } catch (error) {
      console.error("Signup/Auto-login failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed on server:", error);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("studly_auth");
  }, []);

  const updateUser = useCallback(
    async (updatedData) => {
      try {
        if (!currentUser) return;
        const currentUsername = currentUser.username;
        const response = await updateProfile(currentUsername, updatedData);
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
        setPosts(previousPosts);
        toast.error("Failed to update like.");
      }
    },
    [posts, currentUser, isAuthenticated]
  );

  const handleBookmarkPost = useCallback(
    async (postId, skipAuth = false) => {
      if (!skipAuth && !isAuthenticated) {
        setScrollPosition(window.scrollY);
        setPendingAction({ type: "bookmark", postId });
        setShowAuthModal(true);
        return;
      }
      let previousPosts;
      let previousBookmarks;
      setPosts((prevPosts) => {
        previousPosts = prevPosts;
        return prevPosts.map((post) => {
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
        });
      });
      setBookmarkedPosts((prevBookmarks) => {
        previousBookmarks = prevBookmarks;
        const isAlreadyInBookmarks = prevBookmarks.some((p) => p.id === postId);
        if (isAlreadyInBookmarks) {
          return prevBookmarks.filter((p) => p.id !== postId);
        } else {
          const postToAdd = posts.find((p) => p.id === postId);
          if (postToAdd) {
            return [
              { ...postToAdd, bookmarkedBy: [currentUser.id] },
              ...prevBookmarks,
            ];
          }
          return prevBookmarks;
        }
      });
      try {
        const currentPost = posts.find((p) => p.id === postId);
        const alreadyBookmarked = currentPost?.bookmarkedBy.includes(
          currentUser.id
        );
        if (alreadyBookmarked) {
          await apiUnbookmarkPost(postId);
          toast.success("Removed from bookmarks");
        } else {
          await apiBookmarkPost(postId);
          toast.success("Added to bookmarks");
        }
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
        setPosts(previousPosts);
        setBookmarkedPosts(previousBookmarks);
        toast.error("Failed to update bookmark.");
      }
    },
    [posts, currentUser, isAuthenticated]
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
          avatar: c.commenter_avatar,
        },
        replies: [],
      }));
      setComments((prev) => ({ ...prev, [postId]: formattedComments }));
    } catch (error) {
      console.error("Failed to fetch comments", error);
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
          user: getUserById(post.userId) || post.user,
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
      currentUser,
      login,
      signup,
      logout,
      updateUser,
      requireAuth,
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
      currentUser,
      login,
      signup,
      logout,
      updateUser,
      requireAuth,
      isAuthLoading,
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
