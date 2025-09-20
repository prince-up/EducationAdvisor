import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// Temporary mock for useAuth
const useAuth = () => {
  return {
    user: { id: 1, name: 'Test User' },
    loading: false,
    isAuthenticated: () => true,
    logout: () => console.log('Mock logout')
  };
};

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If auth is initialized and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Show loading message while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's a user, render the children
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;