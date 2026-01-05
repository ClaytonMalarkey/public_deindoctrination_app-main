import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendVerification: (data) => api.post('/auth/resend-verification', data),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyLogin: (data) => api.post('/auth/verify-login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  logout: () => api.post('/auth/logout'),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  getUserProfile: (userId) => api.get(`/users/profile/${userId}`),
  updatePoints: (points) => api.put('/users/points', { points }),
};

// Tasks API calls
export const tasksAPI = {
  getTasks: () => api.get('/tasks'),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  completeTask: (taskId) => api.post(`/tasks/complete/${taskId}`),
};

// Rewards API calls
export const rewardsAPI = {
  getRewards: () => api.get('/rewards'),
  redeemReward: (rewardId) => api.post(`/rewards/redeem/${rewardId}`),
};

// Leaderboard API calls
export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

export default api;
