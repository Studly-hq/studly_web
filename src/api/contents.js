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
    const response = await client.get("/studlygram/posts");
    console.log("Get Posts Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Posts Error:", error.response?.data || error.message);
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
