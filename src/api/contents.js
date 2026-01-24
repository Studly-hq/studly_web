import client from "./client";

export const createPost = async (postData) => {
  try {
    const response = await client.post("/studlygram/post", postData);
    return response.data;
  } catch (error) {
    console.error("Create Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getPosts = async (limit = 100, page = 1) => {
  try {
    const response = await client.get("/studlygram/posts", {
      params: { limit, page }
    });
    return response.data;
  } catch (error) {
    console.error("Get Posts Error:", error.response?.data || error.message);
    throw error;
  }
}

export const getUserPosts = async (username) => {
  try {
    // Note: The endpoint documentation says /studlygram/posts/{username}
    const response = await client.get(`/studlygram/posts/${username}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get User Posts Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPost = async (postId) => {
  try {
    const response = await client.get(`/studlygram/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Get Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const editPost = async (postId, content, tags) => {
  try {
    const payload = { content };
    if (tags) {
      payload.tags = tags;
    }
    const response = await client.put(`/studlygram/post/${postId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Edit Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await client.delete(`/studlygram/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const editComment = async (commentId, content, userId, postId) => {
  try {
    const payload = {
      content,
      comment_id: String(commentId)
    };

    // We already tried user_id/post_id and it failed. 
    // Trying comment_id in body as fallback.

    const response = await client.put(`/studlygram/comment/${commentId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Edit Comment Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await client.delete(`/studlygram/comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Comment Error:", error.response?.data || error.message);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await client.post("/studlygram/like", {
      post_id: postId,
      comment_id: null,
    });
    return response.data;
  } catch (error) {
    console.error("Like Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await client.delete("/studlygram/like", {
      data: {
        post_id: postId,
        comment_id: null,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Unlike Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const likeComment = async (commentId, postId) => {
  try {
    // Backend expects ONLY comment_id for comment likes (not both post_id and comment_id)
    const response = await client.post("/studlygram/like", {
      comment_id: String(commentId),
    });
    return response.data;
  } catch (error) {
    console.error("Like Comment Error:", error.response?.data || error.message);
    throw error;
  }
};

export const unlikeComment = async (commentId, postId) => {
  try {
    // Backend expects ONLY comment_id for comment unlikes (not both post_id and comment_id)
    const response = await client.delete("/studlygram/like", {
      data: {
        comment_id: String(commentId),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Unlike Comment Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createComment = async (
  postId,
  content,
  userId,
  parentCommentId = null
) => {
  try {
    const payload = {
      content,
      post_id: String(postId),
      user_id: String(userId),
    };

    // Only include parent_comment_id if it's actually set (for replies)
    if (parentCommentId) {
      payload.parent_comment_id = String(parentCommentId);
      payload.parent_id = String(parentCommentId); // Redundant fallback
    }

    const response = await client.post(`/studlygram/${postId}/comment`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Create Comment Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const response = await client.get(`/studlygram/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Get Comments Error:", error.response?.data || error.message);
    throw error;
  }
};

export const bookmarkPost = async (postId) => {
  try {
    const response = await client.post(`/studlygram/bookmark/${postId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Bookmark Post Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const unbookmarkPost = async (postId) => {
  try {
    const response = await client.delete(`/studlygram/bookmark/${postId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Unbookmark Post Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookmarks = async () => {
  try {
    const response = await client.get("/studlygram/bookmark");
    return response.data;
  } catch (error) {
    console.error(
      "Get Bookmarks Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPostLikes = async (postId) => {
  try {
    const response = await client.get(`/studlygram/post/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error("Get Post Likes Error:", error.response?.data || error.message);
    // Return empty array on error so UI doesn't break if endpoint missing
    return [];
  }
};

export const getNotifications = async () => {
  try {
    const response = await client.get("/notifications");
    return response.data;
  } catch (error) {
    console.warn("Get Notifications Error (Endpoint might be missing):", error.response?.status);
    // Return empty array so UI shows "No notifications" state instead of crashing
    return [];
  }
};

export const markNotificationsRead = async (ids = []) => {
  try {
    const response = await client.post("/notifications/mark-read", { ids });
    return response.data;
  } catch (error) {
    console.error("Mark Notifications Read Error:", error.response?.data || error.message);
    return null;
  }
};
