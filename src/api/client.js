import axios from "axios";

/**
 * api client
 *
 * Instead of typing 'http://0.0.0.0:8080/...' every time we want to fetch data,
 * we use this 'client'. It automatically knows the base URL.
 */
// Use Railway backend in production, proxy in development
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://studly-server-production.up.railway.app'
  : '';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", // We are sending data in JSON format
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add a request interceptor to include the auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("studly_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle 401 and auto-refresh tokens
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to avoid infinite loops
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        const response = await client.post("/auth/refresh-token");
        const { token, refresh_token } = response.data;

        if (token) {
          localStorage.setItem("studly_token", token);
          if (refresh_token) {
            localStorage.setItem("studly_refresh_token", refresh_token);
          }

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          processQueue(null, token);

          return client(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError, null);

        localStorage.removeItem("studly_token");
        localStorage.removeItem("studly_refresh_token");

        // Dispatch a custom event so the app can handle logout
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
