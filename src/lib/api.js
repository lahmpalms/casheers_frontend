// lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
});

// Request interceptor: add the access token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if a 401 error is encountered, try to refresh the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 and we haven't retried yet, attempt refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/auth/refresh`,
            { refresh_token: refreshToken },
            {
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          // Save new tokens
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          // Update the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          // Optionally redirect to login page if refresh fails
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
