import client from "./client";

/**
 * Auth API Service
 *
 * This file contains specific functions for authentication (signup, login, etc.).
 * It uses the 'client' we created in client.js to actually send the messages.
 *
 * Modularizing (separating) this code helps keep our project organized.
 * If the signup URL changes, we only fix it here, not in every component.
 */

export const signup = async (email, password, name = null) => {
  try {
    const response = await client.post("/auth/signup", {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await client.post("/auth/login", {
      email,
      password,
    });
    return response.data; // Expecting { token, refresh_token, status }
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export const refreshToken = async (token) => {
  try {
    const response = await client.post("/auth/refresh-token", {
      refresh_token: token
    });
    return response.data;
  } catch (error) {
    console.error("Refresh Token Error:", error.response?.data || error.message);
    throw error;
  }
};

export const sync = async (accessToken, refreshToken) => {
  try {
    const response = await client.post("/auth/sync", {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error("Sync Error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await client.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    throw error;
  }
};

export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await client.post("/auth/change-password", {
      email,
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Change Password Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
