import client from "./client";

export const createPost = async (postData) => {
  try {
    const response = await client.post("/content/post", postData);
    console.log("Create Post Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Create Post Error:", error.response?.data || error.message);
    throw error;
  }
};
