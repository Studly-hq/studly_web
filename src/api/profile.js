import client from "./client";

/**
 * Profile API Service
 *
 * Functions related to user profile.
 */

// Helper to map backend user to frontend user
const mapBackendUserToFrontend = (backendUser) => {
  if (!backendUser) return null;
  return {
    id: backendUser.id || backendUser.user_id, // Ensure we capture ID if available
    username: backendUser.username,
    displayName: backendUser.name || backendUser.username, // Fallback to username
    email: backendUser.email,
    bio: backendUser.bio || "",
    avatar: backendUser.avatar_url, // Map avatar_url to avatar
    created_at: backendUser.created_at || new Date().toISOString(),
    streak: backendUser.streak || 0, // Default if missing
    auraPoints: backendUser.aura_points || 0, // Default if missing, note snake_case
    following: backendUser.following_count || 0,
    followers: backendUser.followers_count || 0,
  };
};

// Get current authenticated user's profile
export const getProfile = async () => {
  try {
    const response = await client.get("/profile/profile");
    return mapBackendUserToFrontend(response.data);
  } catch (error) {
    console.error("Get Profile Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a user's profile by their username.
 * @param {string} username - The username to look up.
 * @returns {Promise<object>} - The user's profile data.
 */
export const getProfileByUsername = async (username) => {
  try {
    const response = await client.get(`/profile/profile/${username}`);
    return mapBackendUserToFrontend(response.data);
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
    return mapBackendUserToFrontend(response.data);
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserStreak = async (username) => {
  try {
    const response = await client.get(`/studlygram/streak/${username}`);
    return response.data?.current_streak || 0;
  } catch (error) {
    console.error(
      "Get User Streak Error:",
      error.response?.data || error.message
    );
    // Return 0 on error so UI doesn't break
    return 0;
  }
};

export const getUserAuraPoints = async (username) => {
  try {
    const response = await client.get(`/studlygram/aura-points/${username}`);
    // Based on the screenshot provided, the response body is just a number "5".
    // So response.data should be directly the number or convertible to it.
    return response.data;
  } catch (error) {
    console.error(
      "Get User Aura Points Error:",
      error.response?.data || error.message
    );
    return 0;
  }
};

export const acknowledgeCelebration = async (milestoneType, milestoneValue) => {
  try {
    await client.post('/studlygram/celebrations/acknowledge', {
      milestone_type: milestoneType,
      milestone_value: milestoneValue
    });
  } catch (error) {
    console.error(
      "Acknowledge Celebration Error:",
      error.response?.data || error.message
    );
    // Don't throw - celebration acknowledgment is fire-and-forget
  }
};

/**
 * Get a signed JWT token for Lucid study app integration.
 * The token contains user info and is valid for 60 seconds.
 * @returns {Promise<string>} - The signed JWT token
 */
export const getStudyToken = async () => {
  try {
    const response = await client.get('/auth/study-token');
    return response.data.token;
  } catch (error) {
    console.error(
      "Get Study Token Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
