// @ts-nocheck
/**
 * New Auth Page Component
 * Replaces existing Supabase authentication with custom authentication system
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import CustomAuthRouter from './auth/CustomAuthRouter';

const NewAuthPage = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't show auth page
  if (user) {
    return null;
  }

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DebateWorld</h1>
          <p className="text-gray-600">Join the conversation and debate the world's most important topics</p>
        </div>
        
        <CustomAuthRouter onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};

export default NewAuthPage;