import axios from "axios";

/**
 * api client
 *
 * Instead of typing 'http://0.0.0.0:8080/...' every time we want to fetch data,
 * we use this 'client'. It automatically knows the base URL.
 */
const client = axios.create({
  // baseURL is removed because we are using a proxy in package.json
  headers: {
    "Content-Type": "application/json", // We are sending data in JSON format
    "ngrok-skip-browser-warning": "true",
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

export default client;
