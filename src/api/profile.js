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
