import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// API configuration
const API_URL = 'http://localhost:8000';

// API client
const api = {
  get: async (url, token) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${url}`, { headers });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return { data: await response.json() };
  },
  post: async (url, data) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw { 
        response: { 
          data: responseData 
        } 
      };
    }
    
    return { data: responseData };
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token and fetch user profile
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get('/api/users/me', token); // Changed from '/users/me' to '/api/users/me'
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/token', { username: email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('auth_token', access_token);
      await fetchUserProfile(access_token);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/users/', userData); // Changed from '/users' to '/api/users/'
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Add isAuthenticated method for compatibility with index.js
  return {
    ...context,
    isAuthenticated: () => !!context.user
  };
};

export default AuthContext;