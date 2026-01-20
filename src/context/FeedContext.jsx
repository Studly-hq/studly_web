import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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
import { useAuth } from "./AuthContext";
import { useUI } from "./UIContext";

const FeedContext = createContext();

export const useFeed = () => {
    const context = useContext(FeedContext);
    if (!context) {
        throw new Error("useFeed must be used within FeedProvider");
    }
    return context;
};

export const FeedProvider = ({ children }) => {
    const { currentUser, isAuthenticated, logout } = useAuth();
    const { setScrollPosition, setPendingAction, setShowAuthModal } = useUI();

    const [posts, setPosts] = useState([]);
    const [isFeedLoading, setIsFeedLoading] = useState(true);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);
    const [comments, setComments] = useState({});

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
                avatar: post.creator_avatar || null,
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
                type: images.length > 0 ? (images.length > 1 ? "carousel" : "single-image") : "text",
                content: post.post_content || "",
                timestamp: timestamp,
                likeCount: post.post_like_count || 0,
                commentCount: post.post_comment_count || 0,
                userId: post.creator_id,
                likes: post.post_is_liked_by_requester && currentUser ? [currentUser.id] : [],
                bookmarkedBy: post.post_is_bookmarked_by_requester && currentUser ? [currentUser.id] : [],
                tags: post.post_hashtags || [],
                images: images,
                user: postUser,
            };
        },
        [currentUser]
    );

    const fetchFeedPosts = useCallback(async () => {
        setIsFeedLoading(true);
        try {
            const serverPosts = await apiGetPosts();
            const mappedPosts = (serverPosts || []).map(mapBackendPostToFrontend);
            setPosts(mappedPosts);
        } catch (error) {
            if (error.response?.status === 401 && error.response?.data?.error === "User record not found") {
                logout();
            }
        } finally {
            setIsFeedLoading(false);
        }
    }, [mapBackendPostToFrontend, logout]);

    const fetchBookmarks = useCallback(async () => {
        if (!isAuthenticated) return;
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
    }, [mapBackendPostToFrontend, isAuthenticated]);

    useEffect(() => {
        fetchFeedPosts();
        if (isAuthenticated) {
            fetchBookmarks();
        }
    }, [isAuthenticated, fetchFeedPosts, fetchBookmarks]);

    const updatePostInState = useCallback((postId, newContent) => {
        setPosts(prev => prev.map(p => String(p.id) === String(postId) ? { ...p, content: newContent } : p));
        setBookmarkedPosts(prev => prev.map(p => String(p.id) === String(postId) ? { ...p, content: newContent } : p));
    }, []);

    const deletePostFromState = useCallback((postId) => {
        setPosts(prev => prev.filter(p => String(p.id) !== String(postId)));
        setBookmarkedPosts(prev => prev.filter(p => String(p.id) !== String(postId)));
    }, []);

    const addComment = useCallback(async (postId, content, parentCommentId = null) => {
        try {
            const newCommentData = await apiCreateComment(postId, content, currentUser.id, parentCommentId);
            const formattedComment = {
                id: newCommentData.comment_id,
                content: newCommentData.comment_content,
                timestamp: newCommentData.comment_created_at,
                likes: [],
                likeCount: 0,
                user: {
                    id: currentUser.id,
                    username: currentUser.username,
                    name: currentUser.displayName,
                    avatar: currentUser.avatar || null,
                },
                replies: [],
                parentCommentId: parentCommentId,
            };

            if (parentCommentId) {
                // Add as a reply to the parent comment
                setComments((prev) => {
                    const postComments = prev[postId] || [];
                    return {
                        ...prev,
                        [postId]: postComments.map((c) => {
                            if (String(c.id) === String(parentCommentId)) {
                                return {
                                    ...c,
                                    replies: [...(c.replies || []), formattedComment],
                                };
                            }
                            return c;
                        }),
                    };
                });
            } else {
                // Add as a top-level comment
                setComments((prev) => ({
                    ...prev,
                    [postId]: [formattedComment, ...(prev[postId] || [])],
                }));
            }

            setPosts((prev) =>
                prev.map((p) =>
                    String(p.id) === String(postId)
                        ? { ...p, commentCount: (p.commentCount || 0) + 1 }
                        : p
                )
            );

            return formattedComment;
        } catch (error) {
            console.error("Failed to add comment:", error);
            throw error;
        }
    }, [currentUser]);

    const updateCommentInState = useCallback((postId, commentId, newContent) => {
        setComments((prev) => ({
            ...prev,
            [postId]: (prev[postId] || []).map((c) =>
                String(c.id) === String(commentId) ? { ...c, content: newContent } : c
            ),
        }));
    }, []);

    const deleteCommentFromState = useCallback((postId, commentId) => {
        setComments((prev) => ({
            ...prev,
            [postId]: (prev[postId] || []).filter((c) => String(c.id) !== String(commentId)),
        }));
        setPosts((prev) =>
            prev.map((p) =>
                String(p.id) === String(postId)
                    ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) }
                    : p
            )
        );
    }, []);

    const getCommentsForPost = useCallback(
        (postId) => comments[postId] || [],
        [comments]
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
        }
    }, []);

    const handleLikePost = useCallback(
        async (postId, action = null, skipAuth = false) => {
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
                        const shouldLike = action ? action === 'like' : !hasLiked;
                        if (shouldLike === hasLiked) return post;
                        return {
                            ...post,
                            likes: shouldLike ? [...post.likes, currentUser.id] : post.likes.filter((id) => id !== currentUser.id),
                            likeCount: shouldLike ? post.likeCount + 1 : post.likeCount - 1,
                        };
                    }
                    return post;
                });
            });
            try {
                const shouldLikeAction = action ? (action === 'like') : !posts.find(p => p.id === postId)?.likes.includes(currentUser.id);
                if (shouldLikeAction) await apiLikePost(postId);
                else await apiUnlikePost(postId);
            } catch (error) {
                setPosts(previousPosts);
            }
        },
        [posts, currentUser, isAuthenticated, setScrollPosition, setPendingAction, setShowAuthModal]
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
                } else {
                    await apiBookmarkPost(postId);
                }
            } catch (error) {
                setPosts(previousPosts);
                setBookmarkedPosts(previousBookmarks);
            }
        },
        [posts, currentUser, isAuthenticated, bookmarkedPosts]
    );

    const handleLikeComment = useCallback(
        (postId, commentId, skipAuth = false) => {
            if (!skipAuth && !isAuthenticated) {
                setScrollPosition(window.scrollY);
                setPendingAction({ type: "like-comment", postId, commentId });
                setShowAuthModal(true);
                return;
            }
            setComments((prev) => {
                const postComments = prev[postId] || [];
                return {
                    ...prev,
                    [postId]: postComments.map((c) => {
                        if (String(c.id) === String(commentId)) {
                            const hasLiked = c.likes?.includes(currentUser.id);
                            return {
                                ...c,
                                likes: hasLiked
                                    ? c.likes.filter((id) => id !== currentUser.id)
                                    : [...(c.likes || []), currentUser.id],
                                likeCount: hasLiked ? c.likeCount - 1 : c.likeCount + 1,
                            };
                        }
                        return c;
                    }),
                };
            });
        },
        [currentUser, isAuthenticated, setScrollPosition, setPendingAction, setShowAuthModal]
    );

    const requireAuth = useCallback(
        (actionData = null) => {
            if (isAuthenticated) {
                return true;
            } else {
                setScrollPosition(window.scrollY);
                if (actionData) setPendingAction(actionData);
                setShowAuthModal(true);
                return false;
            }
        },
        [isAuthenticated, setScrollPosition, setPendingAction, setShowAuthModal]
    );

    const fetchPostById = useCallback(
        async (postId) => {
            try {
                const existingPost = posts.find((p) => String(p.id) === String(postId));
                if (existingPost) return existingPost;

                try {
                    const serverPost = await apiGetPost(postId);
                    if (serverPost) {
                        return mapBackendPostToFrontend(serverPost);
                    }
                } catch (singlePostError) {
                    const allPosts = await apiGetPosts();
                    const targetPost = allPosts.find((p) => String(p.post_id) === String(postId));
                    if (targetPost) {
                        return mapBackendPostToFrontend(targetPost);
                    }
                }
                return null;
            } catch (error) {
                console.error("Failed to fetch post:", error);
                return null;
            }
        },
        [posts, mapBackendPostToFrontend]
    );

    const fetchUserPosts = useCallback(
        async (username) => {
            try {
                const serverPosts = await apiGetUserPosts(username);
                return serverPosts.map(mapBackendPostToFrontend);
            } catch (error) {
                return [];
            }
        },
        [mapBackendPostToFrontend]
    );

    const createPost = useCallback(
        async (postData) => {
            try {
                const newPost = await apiCreatePost(postData);
                const formattedPost = mapBackendPostToFrontend(newPost);
                setPosts((prev) => [formattedPost, ...prev]);
                return formattedPost;
            } catch (error) {
                console.error("Failed to create post:", error);
                throw error;
            }
        },
        [mapBackendPostToFrontend]
    );

    const value = useMemo(() => ({
        posts,
        isFeedLoading,
        fetchFeedPosts,
        updatePostInState,
        deletePostFromState,
        bookmarkedPosts,
        isBookmarksLoading,
        fetchBookmarks,
        comments,
        fetchCommentsForPost,
        handleLikePost,
        handleBookmarkPost,
        fetchPostById,
        fetchUserPosts,
        addComment,
        updateCommentInState,
        deleteCommentFromState,
        getCommentsForPost,
        handleLikeComment,
        requireAuth,
        createPost
    }), [
        posts,
        isFeedLoading,
        fetchFeedPosts,
        updatePostInState,
        deletePostFromState,
        bookmarkedPosts,
        isBookmarksLoading,
        fetchBookmarks,
        comments,
        fetchCommentsForPost,
        handleLikePost,
        handleBookmarkPost,
        fetchPostById,
        fetchUserPosts,
        addComment,
        updateCommentInState,
        deleteCommentFromState,
        getCommentsForPost,
        handleLikeComment,
        requireAuth,
        createPost
    ]);

    return (
        <FeedContext.Provider value={value}>
            {children}
        </FeedContext.Provider>
    );
};
