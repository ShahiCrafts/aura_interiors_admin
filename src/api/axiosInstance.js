import axios from "axios";
import { setTokenInState } from "../context/AuthContext";

// Function to get the token from localStorage
const getAuthToken = () => localStorage.getItem("token");
// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json", // default header for JSON payloads
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`; // Attach token to the headers
    return config; // continue the request
  },
  (error) => Promise.reject(error)
);

// tracks if a refresh request is in progress
let isRefreshing = false;
// to store requests that failed while waiting for refresh
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((error) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"
          }/auth/token/refresh`,
          {
            refreshToken,
          }
        );

        localStorage.setItem("token", data.accessToken);
        setTokenInState(data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);

        return api(originalRequest);
      } catch (error) {
        processQueue(error, null);
        signOut();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
