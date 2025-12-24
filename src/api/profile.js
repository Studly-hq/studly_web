import client from "./client";

/**
 * Profile API Service
 *
 * Functions related to user profile.
 */

// NOTE: This function is no longer used - using getProfileByUsername instead
// export const getProfile = async () => {
//   try {
//     const response = await client.get("/profile/profile");
//     console.log("Get Profile Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Get Profile Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

/**
 * Get a user's profile by their username.
 * @param {string} username - The username to look up.
 * @returns {Promise<object>} - The user's profile data.
 */
export const getProfileByUsername = async (username) => {
  try {
    const response = await client.get(`/profile/profile/${username}`);
    console.log("Get Profile By Username Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Get Profile By Username Error:",
      error.response?.data || error.message
    );
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
