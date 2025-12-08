import axios from "axios";

/**
 * api client
 *
 * Instead of typing 'http://0.0.0.0:8080/...' every time we want to fetch data,
 * we use this 'client'. It automatically knows the base URL.
 */
const client = axios.create({
  // baseURL is removed because we are using a proxy in package.json
  // Requesting '/auth/signup' will automatically forward to 'http://0.0.0.0:8080/auth/signup'
  headers: {
    "Content-Type": "application/json", // We are sending data in JSON format
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

export default client;
