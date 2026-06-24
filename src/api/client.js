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
  withCredentials: true,
  timeout: 300000,
  headers: {
    "Accept": "application/json"
  }
});

client.interceptors.request.use(
  (config) => {
    // ROBUST FIX: Backend strictly requires Content-Type: application/json for ALL requests
    // Even GET requests must have this header and a parseable body
    config.headers["Content-Type"] = "application/json";

    // Ensure there's a body for methods that might be checked by the backend
    // Some backend frameworks/proxies fail with 415 if Content-Type is set but body is empty/missing
    if (["get", "delete", "post", "put", "patch"].includes(config.method?.toLowerCase()) && !config.data) {
      config.data = {};
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

    // Handle 429 Too Many Requests to format a user-friendly error with retry time
    if (error.response?.status === 429) {
      const retryAfter = error.response.data?.retry_after;
      if (retryAfter) {
        let timeString = "";
        if (retryAfter < 60) {
          timeString = `${retryAfter} second${retryAfter !== 1 ? 's' : ''}`;
        } else {
          const minutes = Math.floor(retryAfter / 60);
          const seconds = retryAfter % 60;
          if (seconds > 0) {
            timeString = `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
          } else {
            timeString = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
          }
        }
        const friendlyMessage = `Too many requests. Please try again after ${timeString}.`;
        
        if (error.response.data && typeof error.response.data === 'object') {
          error.response.data.error = friendlyMessage;
          error.response.data.message = friendlyMessage;
        }
        error.message = friendlyMessage;
      }
    }

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh if we are already doing something auth-relevant
      // or if it's an initialization call that should just fail gracefully
      if ((originalRequest.url?.includes('/auth/') && !originalRequest.url?.includes('/auth/study-token')) || originalRequest.url?.includes('/profile/profile')) {
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
        // Send refresh_token via body in addition to cookies (for environments where cookies fail)
        const cachedRefreshToken = localStorage.getItem("refresh_token");
        const body = cachedRefreshToken ? { refresh_token: cachedRefreshToken } : {};
        const response = await client.post("/auth/refresh-token", body);
        const { token, refresh_token: newRefreshToken } = response.data;

        if (token) {
          // Update local storage and set header back up
          localStorage.setItem("token", token);
          if (newRefreshToken) localStorage.setItem("refresh_token", newRefreshToken);
          
          setAuthToken(token);
          processQueue(null, token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - cookies might be expired or invalid
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError, null);

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

// Helper to set the auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common["Authorization"];
  }
};

// Initialize token from localStorage if present
const initialToken = localStorage.getItem("token");
if (initialToken) {
  setAuthToken(initialToken);
}

export default client;
