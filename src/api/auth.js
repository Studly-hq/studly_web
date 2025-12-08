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

export const signup = async (email, password) => {
  try {
    // We are sending a POST request to '/auth/signup'
    // The 'client' adds the base URL (http://0.0.0.0:8080) automatically.
    // So the full URL becomes: http://0.0.0.0:8080/auth/signup
    const response = await client.post("/auth/signup", {
      email,
      password,
    });

    // If successful, we return the data from the server
    console.log("Signup Response:", response.data);
    return response.data;
  } catch (error) {
    // If there's an error (like "Email already exists"), we throw it
    // so the component calling this function can catch it and show an alert.
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
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};
