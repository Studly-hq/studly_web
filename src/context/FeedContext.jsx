import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    createPost as apiCreatePost,
    getPosts as apiGetPosts,
    getUserPosts as apiGetUserPosts,
    getPost as apiGetPost,
    likePost as apiLikePost,
    unlikePost as apiUnlikePost,
    likeComment as apiLikeComment,
    unlikeComment as apiUnlikeComment,
    createComment as apiCreateComment,
    getComments as apiGetComments,
    bookmarkPost as apiBookmarkPost,
    unbookmarkPost as apiUnbookmarkPost,
    getBookmarks as apiGetBookmarks,
    getFeed as apiGetFeed,
} from "../api/contents";
import { useAuth } from "./AuthContext";
import { useUI } from "./UIContext";

const FeedContext = createContext();

export const FEED_TYPES = {
    PERSONALIZED: 'personalized',
    DISCOVERY: 'discovery',
    BOOKMARKS: 'bookmarks',
    USER: 'user'
};

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
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);
    const [comments, setComments] = useState({});

    // Robust Feed State Machine
    const [loadingState, setLoadingState] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'loadingMore' | 'error'
    const [feedMode, setFeedMode] = useState('discovery'); // 'personalized' | 'discovery'
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [personalizedExhausted, setPersonalizedExhausted] = useState(false);
    const [backgroundPosts, setBackgroundPosts] = useState([]);
    const [hasNewBackgroundPosts, setHasNewBackgroundPosts] = useState(false);

    // Track initialization to avoid redundant calls
    const inFlightInitRef = useRef(false);

    // Map backend post to frontend format
    const mapBackendPostToFrontend = useCallback(
        (post) => {
            if (!post) return null;
            const images = Array.isArray(post.post_media)
                ? post.post_media
                    .filter((url) => url && url !== "placeholder")
                    .map((url) => ({ url: url, alt: "Post Image" }))
                : [];

            const postUser = {
                id: post.creator_id,
                username: post.creator_username || `user${post.creator_id}`,
                displayName: post.creator_name || post.creator_username || `User ${post.creator_id}`,
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

    /**
     * Core Fetching Logic
     */
    const initializeFeed = useCallback(async () => {
        if (inFlightInitRef.current) return;

        inFlightInitRef.current = true;
        setLoadingState('loading');

        // Reset state for new load
        setPosts([]);
        setPage(1);
        setHasMore(true);
        setPersonalizedExhausted(false);
        setBackgroundPosts([]);
        setHasNewBackgroundPosts(false);

        try {
            const mode = isAuthenticated ? 'personalized' : 'discovery';
            setFeedMode(mode);

            let serverPosts = [];
            if (mode === 'personalized') {
                serverPosts = await apiGetFeed(50, 1);
                // If personalized feed is empty or has very few posts, supplement with discovery
                if (!serverPosts || serverPosts.length < 10) {
                    const personalizedPosts = serverPosts || [];
                    const personalizedIds = new Set(personalizedPosts.map(p => String(p.post_id)));

                    // Mark as exhausted if we got only a few personalized posts
                    if (personalizedPosts.length < 5) {
                        setPersonalizedExhausted(true);
                        setFeedMode('discovery');
                    }

                    // Fetch discovery posts to fill the gap
                    const discoveryPosts = await apiGetPosts(50, 1);
                    const uniqueDiscoveryPosts = (discoveryPosts || []).filter(p => !personalizedIds.has(String(p.post_id)));

                    // Combine: personalized first, then discovery
                    serverPosts = [...personalizedPosts, ...uniqueDiscoveryPosts];
                }
            } else {
                serverPosts = await apiGetPosts(50, 1);
            }

            const mappedPosts = (serverPosts || []).map(mapBackendPostToFrontend).filter(Boolean);
            setPosts(mappedPosts);

            // If in personalized mode, we always have "more" until we explicitly exhaust and switch to discovery
            const shouldHaveMore = mappedPosts.length >= 50 || (mode === 'personalized' && !personalizedExhausted);
            setHasMore(shouldHaveMore);

            setLoadingState('ready');
        } catch (error) {
            console.error('[FeedContext] Initialization error:', error);
            setLoadingState('error');
            // Check for specific backend errors that should trigger logout
            if (error.response?.status === 401 && error.response?.data?.error === "User record not found") {
                logout();
            }
        } finally {
            inFlightInitRef.current = false;
        }
    }, [isAuthenticated, mapBackendPostToFrontend, logout, personalizedExhausted]);

    const loadMorePosts = useCallback(async () => {
        if (loadingState === 'loadingMore' || !hasMore) return;

        setLoadingState('loadingMore');
        const nextPage = page + 1;

        try {
            let serverPosts = [];
            if (feedMode === 'personalized' && !personalizedExhausted) {
                serverPosts = await apiGetFeed(50, nextPage);
                if (!serverPosts || serverPosts.length === 0) {
                    setPersonalizedExhausted(true);
                    setFeedMode('discovery');
                    serverPosts = await apiGetPosts(50, 1);
                    setPage(1);
                } else {
                    setPage(nextPage);
                }
            } else {
                serverPosts = await apiGetPosts(50, nextPage);
                setPage(nextPage);
            }

            const mappedPosts = (serverPosts || []).map(mapBackendPostToFrontend).filter(Boolean);
            setPosts(prev => {
                const existingIds = new Set(prev.map(p => String(p.id)));
                const uniqueNew = mappedPosts.filter(p => !existingIds.has(String(p.id)));
                return [...prev, ...uniqueNew];
            });

            setHasMore(mappedPosts.length >= 50 || (feedMode === 'personalized' && !personalizedExhausted));
            setLoadingState('ready');
        } catch (error) {
            console.error('[FeedContext] Load more error:', error);
            setLoadingState('ready'); // Revert to ready so they can try again or just stop
        }
    }, [loadingState, hasMore, page, feedMode, personalizedExhausted, mapBackendPostToFrontend]);

    /**
     * Polling and Compatibility
     */
    const fetchFeedPosts = useCallback(async (options = {}) => {
        const { forceLoading = false, isQuiet = false } = options;

        if (isQuiet) {
            try {
                const serverPosts = feedMode === 'personalized' && !personalizedExhausted
                    ? await apiGetFeed(50, 1)
                    : await apiGetPosts(50, 1);

                const mappedPosts = (serverPosts || []).map(mapBackendPostToFrontend).filter(Boolean);
                const existingIds = new Set(posts.map(p => String(p.id)));
                const newPosts = mappedPosts.filter(p => !existingIds.has(String(p.id)));

                if (newPosts.length > 0) {
                    setBackgroundPosts(newPosts);
                    setHasNewBackgroundPosts(true);
                }
            } catch (error) {
                console.warn('[FeedContext] Polling failed:', error);
            }
            return;
        }

        if (forceLoading || loadingState === 'idle' || loadingState === 'error') {
            await initializeFeed();
        }
    }, [feedMode, personalizedExhausted, posts, mapBackendPostToFrontend, initializeFeed, loadingState]);

    const applyBackgroundPosts = useCallback(() => {
        if (backgroundPosts.length > 0) {
            setPosts(prev => {
                const existingIds = new Set(prev.map(p => String(p.id)));
                const uniqueNew = backgroundPosts.filter(p => !existingIds.has(String(p.id)));
                return [...uniqueNew, ...prev];
            });
            setBackgroundPosts([]);
            setHasNewBackgroundPosts(false);
        }
    }, [backgroundPosts]);

    const switchToDiscovery = useCallback(async () => {
        if (loadingState === 'loadingMore' || loadingState === 'loading') return;

        setLoadingState('loadingMore');
        setPersonalizedExhausted(true);
        setFeedMode('discovery');

        try {
            const discoveryPosts = await apiGetPosts(50, 1);
            const mapped = (discoveryPosts || []).map(mapBackendPostToFrontend).filter(Boolean);

            setPosts(prev => {
                const existingIds = new Set(prev.map(p => String(p.id)));
                const uniqueNew = mapped.filter(p => !existingIds.has(String(p.id)));
                return [...prev, ...uniqueNew];
            });

            setPage(1);
            setHasMore(mapped.length >= 50);
            setLoadingState('ready');
        } catch (error) {
            console.error("[FeedContext] Switch to discovery failed:", error);
            setLoadingState('ready');
        }
    }, [loadingState, mapBackendPostToFrontend]);

    const isFeedLoadingView = useMemo(() => loadingState === 'loading' || loadingState === 'idle', [loadingState]);

    const fetchBookmarks = useCallback(async () => {
        if (!isAuthenticated || isBookmarksLoading) return;
        setIsBookmarksLoading(true);
        try {
            const serverBookmarks = await apiGetBookmarks();
            setBookmarkedPosts((serverBookmarks || []).map(mapBackendPostToFrontend).filter(Boolean));
        } catch (error) {
            console.error("[FeedContext] Bookmarks error:", error);
        } finally {
            setIsBookmarksLoading(false);
        }
    }, [isAuthenticated, mapBackendPostToFrontend, isBookmarksLoading]);

    // Handle Initialization and Auth Transitions
    useEffect(() => {
        // Clear state immediately on auth change to avoid stale content flash
        setLoadingState('idle');
        setPosts([]);

        // Let the FeedPage or direct hook consumers call initializeFeed
        // but we trigger it here if it's already idle
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookmarks();
        } else {
            setBookmarkedPosts([]);
        }
    }, [isAuthenticated, fetchBookmarks]);

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

            // Map backend response using robust logic (similar to mapBackendCommentToFrontend)
            const formattedComment = {
                id: String(newCommentData.comment_id || newCommentData.id || newCommentData.uuid || Math.random().toString(36).substr(2, 9)),
                content: newCommentData.comment_content || newCommentData.content || content,
                timestamp: newCommentData.comment_created_at || newCommentData.created_at || new Date().toISOString(),
                likes: [],
                likeCount: 0,
                userId: currentUser.id,
                parentCommentId: parentCommentId || newCommentData.parent_comment_id || newCommentData.parent_id || null,
                user: {
                    id: currentUser.id,
                    username: currentUser.username,
                    name: currentUser.name || currentUser.username,
                    avatar: currentUser.avatar,
                },
                replies: [],
            };



            if (parentCommentId) {
                // Add as a reply to the parent comment - need to search recursively
                const addReplyToParent = (commentsList) => {
                    return commentsList.map((c) => {
                        if (String(c.id) === String(parentCommentId)) {
                            return {
                                ...c,
                                replies: [...(c.replies || []), formattedComment],
                            };
                        }
                        // Also check in nested replies
                        if (c.replies && c.replies.length > 0) {
                            return {
                                ...c,
                                replies: addReplyToParent(c.replies),
                            };
                        }
                        return c;
                    });
                };

                setComments((prev) => {
                    const postComments = prev[postId] || [];
                    return {
                        ...prev,
                        [postId]: addReplyToParent(postComments),
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

    // Recursive mapping helper
    const mapBackendCommentToFrontend = useCallback((c) => {
        // Basic mapping for the comment itself
        const mapped = {
            id: String(c.comment_id || c.id || c.uuid),
            content: c.comment_content || c.content || "",
            timestamp: c.comment_created_at || c.created_at || new Date().toISOString(),
            likes: (c.comment_is_liked_by_requester || c.is_liked) && currentUser ? [currentUser.id] : [],
            likeCount: c.comment_like_count || c.like_count || 0,
            replyCount: c.comment_reply_count || c.reply_count || 0,
            userId: c.commenter_user_id || c.author_id || c.user_id,
            parentCommentId: c.parent_comment_id || c.parent_id || c.parent || null,
            user: {
                id: c.commenter_user_id || c.author_id || c.user_id,
                username: c.commenter_username || c.author_username || c.username || "user",
                name: c.commenter_name || c.author_name || c.name || "",
                avatar: c.commenter_avatar || c.author_avatar || c.avatar_url || c.avatar || null,
            },
            // Initialize replies array
            replies: []
        };

        // Recursively map replies if they exist in the backend response
        if (c.replies && Array.isArray(c.replies) && c.replies.length > 0) {
            mapped.replies = c.replies.map(reply => mapBackendCommentToFrontend(reply));
        }

        return mapped;
    }, [currentUser]);

    const fetchCommentsForPost = useCallback(async (postId) => {
        try {
            const commentsData = await apiGetComments(postId);

            // 1. Map all comments recursively first
            const allComments = commentsData.map(mapBackendCommentToFrontend);

            // 2. Build Hierarchy
            // Even if backend sends nested data, we might receive some flat list items mixed in, 
            // or we might want to ensure everything is strictly structured.

            const commentMap = new Map();
            const topLevelComments = [];

            // Helper to collect all comments into a flat map for re-nesting (safety net)
            // This handles cases where backend might return a mixed structure
            const traverseAndMap = (list) => {
                list.forEach(item => {
                    commentMap.set(String(item.id), item);
                    if (item.replies && item.replies.length > 0) {
                        traverseAndMap(item.replies);
                    }
                });
            };
            traverseAndMap(allComments);

            // Now reconstruct the tree using the map to ensure parent-child relationships are respected
            // Use the original list to determine top-level vs nested if possible, 
            // but the robust way is to check parentCommentId.

            commentMap.forEach((comment) => {
                const parentId = comment.parentCommentId;

                if (parentId && String(parentId) !== "0" && String(parentId) !== "null") {
                    const parent = commentMap.get(String(parentId));
                    if (parent) {
                        // Check if already added to avoid duplication if backend sent it nested
                        const alreadyExists = parent.replies.some(r => String(r.id) === String(comment.id));
                        if (!alreadyExists) {
                            parent.replies.push(comment);
                        }
                    } else {
                        // Orphaned reply or parent not in this batch - treat as top level or specific error handling
                        // For now, show as top level so it's not lost
                        // Check if it's already in topLevel to avoid dups
                        if (!topLevelComments.some(c => String(c.id) === String(comment.id))) {
                            topLevelComments.push(comment);
                        }
                    }
                } else {
                    // Top level comment
                    // Verify it's not a duplicate
                    if (!topLevelComments.some(c => String(c.id) === String(comment.id))) {
                        topLevelComments.push(comment);
                    }
                }
            });

            // If the reconstruction above yield nothing (e.g. edge case), fallback to the mapped list
            // But usually the map logic is safer.
            // Edge case: Backend returns nested structure where child has parentId but parent isn't in top level list?
            // The traverseAndMap handles that by indexing everything.

            // Recursive sorting
            const sortCommentsRecursive = (commentsList, newestFirst = true) => {
                commentsList.sort((a, b) => {
                    const dateA = new Date(a.timestamp);
                    const dateB = new Date(b.timestamp);
                    return newestFirst ? dateB - dateA : dateA - dateB;
                });

                commentsList.forEach(c => {
                    if (c.replies && c.replies.length > 0) {
                        sortCommentsRecursive(c.replies, false); // Replies oldest first
                    }
                });
            };

            sortCommentsRecursive(topLevelComments, true);

            setComments((prev) => ({ ...prev, [postId]: topLevelComments }));
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    }, [mapBackendCommentToFrontend]);

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
        [posts, currentUser, isAuthenticated, bookmarkedPosts, setPendingAction, setScrollPosition, setShowAuthModal]
    );

    const handleLikeComment = useCallback(
        async (postId, commentId, skipAuth = false) => {
            if (!skipAuth && !isAuthenticated) {
                setScrollPosition(window.scrollY);
                setPendingAction({ type: "like-comment", postId, commentId });
                setShowAuthModal(true);
                return;
            }

            // Store previous state for rollback
            const previousComments = comments;

            // Helper function to find a comment in the hierarchy (including replies)
            const findComment = (commentsList, targetId) => {
                for (const c of commentsList) {
                    if (String(c.id) === String(targetId)) {
                        return c;
                    }
                    if (c.replies && c.replies.length > 0) {
                        const found = findComment(c.replies, targetId);
                        if (found) return found;
                    }
                }
                return null;
            };

            // Helper function to update a comment in the hierarchy
            const updateCommentInList = (commentsList, targetId, updateFn) => {
                return commentsList.map((c) => {
                    if (String(c.id) === String(targetId)) {
                        return updateFn(c);
                    }
                    if (c.replies && c.replies.length > 0) {
                        return {
                            ...c,
                            replies: updateCommentInList(c.replies, targetId, updateFn),
                        };
                    }
                    return c;
                });
            };

            // Perform update
            const postComments = comments[postId] || [];
            const targetComment = findComment(postComments, commentId);
            const hasLiked = targetComment?.likes?.some((id) => String(id) === String(currentUser.id));

            setComments((prev) => {
                const updatedPostComments = prev[postId] || [];

                // Find current state of the comment from latest state
                const currentComment = findComment(updatedPostComments, commentId);
                if (!currentComment) return prev;

                const alreadyLiked = currentComment.likes?.some((id) => String(id) === String(currentUser.id));

                // Toggle liked state
                return {
                    ...prev,
                    [postId]: updateCommentInList(updatedPostComments, commentId, (c) => {
                        const isLikedNow = alreadyLiked;
                        const newLikes = isLikedNow
                            ? (c.likes || []).filter((id) => String(id) !== String(currentUser.id))
                            : [...new Set([...(c.likes || []), currentUser.id])]; // Use Set to prevent duplicates

                        return {
                            ...c,
                            likes: newLikes,
                            likeCount: isLikedNow
                                ? Math.max(0, (c.likeCount || 1) - 1)
                                : (c.likeCount || 0) + 1,
                        };
                    }),
                };
            });

            // Call API based on the toggle state we calculated
            try {
                if (hasLiked) {
                    await apiUnlikeComment(commentId, postId);
                } else {
                    await apiLikeComment(commentId, postId);
                }
            } catch (error) {
                console.error("Failed to like/unlike comment:", error);
                // Rollback on error
                setComments(previousComments);
            }
        },
        [comments, currentUser, isAuthenticated, setScrollPosition, setPendingAction, setShowAuthModal]
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

                // The backend response for a new post may not include all fields
                // that mapBackendPostToFrontend expects, so we build it manually
                const images = Array.isArray(postData.media)
                    ? postData.media
                        .filter((url) => url !== "placeholder")
                        .map((url) => ({ url: url, alt: "Post Image" }))
                    : [];

                // Use backend response id - check multiple possible field names
                // Do NOT fall back to temp ID as it breaks comments/likes
                const postId = newPost.post_id || newPost.id || newPost.uuid || newPost.postId;

                if (!postId) {
                    console.error('[FeedContext] Backend did not return a post ID!', newPost);
                    throw new Error('Post was created but no ID was returned');
                }

                const formattedPost = {
                    id: postId,
                    type: images.length > 0 ? (images.length > 1 ? "carousel" : "single-image") : "text",
                    content: newPost.post_content || newPost.content || postData.content || "",
                    timestamp: newPost.post_created_at || newPost.created_at || new Date().toISOString(),
                    likeCount: 0,
                    commentCount: 0,
                    userId: newPost.creator_id || currentUser?.id,
                    likes: [],
                    bookmarkedBy: [],
                    tags: newPost.post_hashtags || postData.tags || [],
                    images: images,
                    user: {
                        id: newPost.creator_id || currentUser?.id,
                        username: newPost.creator_username || currentUser?.username || "user",
                        displayName: newPost.creator_name || currentUser?.displayName || currentUser?.name || currentUser?.username || "User",
                        avatar: newPost.creator_avatar || currentUser?.avatar || null,
                    },
                };

                setPosts((prev) => [formattedPost, ...prev]);
                return formattedPost;
            } catch (error) {
                console.error("Failed to create post:", error);
                throw error;
            }
        },
        [currentUser]
    );

    // Backward compatible loading flag
    const isFeedLoading = isFeedLoadingView;

    const value = useMemo(() => ({
        posts,
        isFeedLoading,
        loadingState,
        feedMode,
        hasMore,
        personalizedExhausted,
        initializeFeed,
        loadMorePosts,
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
        createPost,
        hasNewBackgroundPosts,
        applyBackgroundPosts,
        switchToDiscovery,
        FEED_TYPES
    }), [
        posts,
        isFeedLoading,
        loadingState,
        feedMode,
        hasMore,
        personalizedExhausted,
        initializeFeed,
        loadMorePosts,
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
        createPost,
        hasNewBackgroundPosts,
        applyBackgroundPosts,
        switchToDiscovery
    ]);

    return (
        <FeedContext.Provider value={value}>
            {children}
        </FeedContext.Provider>
    );
};
