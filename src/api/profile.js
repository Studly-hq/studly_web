import client from "./client";

/**
 * Profile API Service
 *
 * Functions related to user profile.
 */

export const getProfile = async () => {
  try {
    const response = await client.get("/profile/profile");
    console.log("Get Profile Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateProfile = async (currentUsername, profileData) => {
  try {
    const response = await client.put(
      `/profile/profile?username=${currentUsername}`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
