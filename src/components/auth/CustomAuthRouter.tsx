// @ts-nocheck
/**
 * Custom Authentication Router Component
 * Routes between login, registration, and forgot password
 */

import { useState } from 'react';
import CustomLogin from './CustomLogin';
import CustomRegistration from './CustomRegistration';
import CustomForgotPassword from './CustomForgotPassword';

type AuthStep = 'login' | 'register' | 'forgot-password';

interface CustomAuthRouterProps {
  onAuthSuccess: () => void;
}

const CustomAuthRouter = ({ onAuthSuccess }: CustomAuthRouterProps) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');

  console.log('CustomAuthRouter: Current step is', currentStep);

  const handleAuthSuccess = () => {
    console.log('CustomAuthRouter: Auth success triggered');
    onAuthSuccess();
  };

  const handleSwitchToLogin = () => {
    console.log('CustomAuthRouter: Switching to login');
    setCurrentStep('login');
  };

  const handleSwitchToRegister = () => {
    console.log('CustomAuthRouter: Switching to register');
    setCurrentStep('register');
  };

  const handleSwitchToForgotPassword = () => {
    console.log('CustomAuthRouter: Switching to forgot password');
    setCurrentStep('forgot-password');
  };

  const handleResetSuccess = () => {
    setCurrentStep('login');
  };

  switch (currentStep) {
    case 'register':
      return (
        <CustomRegistration
          onRegistrationSuccess={handleAuthSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );
    
    case 'forgot-password':
      return (
        <CustomForgotPassword
          onBackToLogin={handleSwitchToLogin}
          onResetSuccess={handleResetSuccess}
        />
      );
    
    case 'login':
    default:
      return (
        <CustomLogin
          onLoginSuccess={handleAuthSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
        />
      );
  }
};

export default CustomAuthRouter;