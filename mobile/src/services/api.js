import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'https://api.careeradvisor.example.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from AsyncStorage (React Native storage)
    // Note: This is async in reality, but we're simplifying for the interceptor
    // In a real app, you would need to handle this properly
    try {
      const token = global.auth_token; // Using a global variable as a simple solution
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error accessing auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get quiz results by ID
 * @param {string} resultId - The ID of the quiz result to fetch
 * @returns {Promise} - Promise with quiz result data
 */
export const getQuizResults = async (resultId) => {
  try {
    const response = await api.get(`/quiz/results/${resultId}`);
    return response.data;
  } catch (error) {
    console.error('API Error - getQuizResults:', error);
    throw error;
  }
};

/**
 * Submit quiz answers
 * @param {Object} answers - The quiz answers to submit
 * @returns {Promise} - Promise with submission result
 */
export const submitQuizAnswers = async (answers) => {
  try {
    const response = await api.post('/quiz/submit', answers);
    return response.data;
  } catch (error) {
    console.error('API Error - submitQuizAnswers:', error);
    throw error;
  }
};

export default api;