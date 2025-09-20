import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post('/api/token', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/api/users/', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

// Colleges API
export const fetchColleges = async () => {
  const response = await api.get('/api/colleges/');
  return response.data;
};

export const fetchCollege = async (id) => {
  const response = await api.get(`/api/colleges/${id}`);
  return response.data;
};

// Scholarships API
export const fetchScholarships = async () => {
  const response = await api.get('/api/scholarships/');
  return response.data;
};

export const fetchScholarship = async (id) => {
  const response = await api.get(`/api/scholarships/${id}`);
  return response.data;
};

// Quiz API
export const fetchQuizQuestions = async () => {
  const response = await api.get('/api/quiz/questions');
  return response.data;
};

export const submitQuizResults = async (results) => {
  const response = await api.post('/api/quiz/results', results);
  return response.data;
};

export default api;
