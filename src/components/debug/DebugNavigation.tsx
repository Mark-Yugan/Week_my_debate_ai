// @ts-nocheck
/**
 * Debug Navigation Component
 * Simple component to test authentication flow navigation
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DebugNavigation = () => {
  const [currentStep, setCurrentStep] = useState<'login' | 'register' | 'forgot-password'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Navigation Debug - Current Step: {currentStep}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setCurrentStep('login')}
            variant={currentStep === 'login' ? 'default' : 'outline'}
            className="w-full"
          >
            Go to Login
          </Button>
          
          <Button
            onClick={() => setCurrentStep('register')}
            variant={currentStep === 'register' ? 'default' : 'outline'}
            className="w-full"
          >
            Go to Register
          </Button>
          
          <Button
            onClick={() => setCurrentStep('forgot-password')}
            variant={currentStep === 'forgot-password' ? 'default' : 'outline'}
            className="w-full"
          >
            Go to Forgot Password
          </Button>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Current State:</h3>
            <p className="text-sm">Step: {currentStep}</p>
            <p className="text-sm text-gray-600 mt-2">
              This debug component tests state navigation between auth steps.
              If you can see state changes here, the issue is in the actual auth components.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugNavigation;