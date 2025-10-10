
import { useCustomAuth } from '@/hooks/useCustomAuth';
import AuthenticatedApp from '@/components/AuthenticatedApp';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, loading, isAuthenticated } = useCustomAuth();
  const navigate = useNavigate();

  // Function to handle authentication requirement for protected features
  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      navigate('/login', { 
        state: { returnTo: '/', message: 'Please login to access this feature' }
      });
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#009]/10 via-white to-[#0066cc]/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#009] rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-[#009]/20 border-t-[#009] mx-auto"></div>
          </div>
          <p className="text-gray-600 font-light">Loading MyDebate.AI...</p>
        </div>
      </div>
    );
  }

  // Always show the app, but pass authentication status and requireAuth function
  return <AuthenticatedApp isAuthenticated={isAuthenticated} requireAuth={requireAuth} />;
};

export default Index;
