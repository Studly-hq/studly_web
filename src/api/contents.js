import client from "./client";

export const createPost = async (postData) => {
  try {
    const response = await client.post("studlygram/post", postData);
    console.log("Create Post Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Create Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const response = await client.get("/studlygram/feed");
    console.log("Get Posts Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Posts Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserPosts = async (username) => {
  try {
    // Note: The endpoint documentation says /studlygram/posts/{username}
    const response = await client.get(`/studlygram/posts/${username}`);
    console.log("Get User Posts Response:", response.data);
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
    console.log("Get Post Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const editPost = async (postId, content) => {
  try {
    const response = await client.put(`/studlygram/post/${postId}`, {
      content,
    });
    console.log("Edit Post Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Edit Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await client.delete(`/studlygram/post/${postId}`);
    console.log("Delete Post Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const editComment = async (commentId, content) => {
  try {
    const response = await client.put(`/studlygram/comment/${commentId}`, {
      content,
    });
    console.log("Edit Comment Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Edit Comment Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await client.delete(`/studlygram/comment/${commentId}`);
    console.log("Delete Comment Response:", response.data);
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
    console.log("Like Post Response:", response.data);
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
    console.log("Unlike Post Response:", response, response.data);
    return response.data;
  } catch (error) {
    console.error("Unlike Post Error:", error.response?.data || error.message);
    throw error;
  }
};

export const likeComment = async (commentId, postId) => {
  try {
    const response = await client.post("/studlygram/like", {
      post_id: String(postId),
      comment_id: String(commentId),
    });
    console.log("Like Comment Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Like Comment Error:", error.response?.data || error.message);
    throw error;
  }
};

export const unlikeComment = async (commentId, postId) => {
  try {
    const response = await client.delete("/studlygram/like", {
      data: {
        post_id: String(postId),
        comment_id: String(commentId),
      },
    });
    console.log("Unlike Comment Response:", response.data);
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
    const response = await client.post(`/studlygram/${postId}/comment`, {
      content,
      post_id: String(postId),
      user_id: String(userId),
      parent_comment_id: parentCommentId ? String(parentCommentId) : null,
    });
    console.log("Create Comment Response:", response.data);
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
    console.log("Get Comments Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Comments Error:", error.response?.data || error.message);
    throw error;
  }
};

export const bookmarkPost = async (postId) => {
  try {
    const response = await client.post(`/studlygram/bookmark/${postId}`);
    console.log("Bookmark Post Response:", response.data);
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
    console.log("Unbookmark Post Response:", response.data);
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
    console.log("Get Bookmarks Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Get Bookmarks Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
