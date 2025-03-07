import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth related API calls
export const authAPI = {
  login: async (email, password, role = 'user') => {
    const response = await api.post('/auth/login', {
      email,
      password,
      role,
    });
    return response.data;
  },
  // Add other auth-related API calls here as needed
};

export default api; 