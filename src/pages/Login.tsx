
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import NewAuthPage from '@/components/NewAuthPage';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useCustomAuth();
  
  // Get return URL from location state
  const returnTo = location.state?.returnTo || '/';
  const message = location.state?.message;

  useEffect(() => {
    // If user is already authenticated, redirect to return URL
    if (!loading && user) {
      navigate(returnTo);
    }
  }, [user, loading, navigate, returnTo]);

  const handleAuthSuccess = () => {
    navigate(returnTo);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the new auth page
  return <NewAuthPage message={message} />;
};

export default Login;
