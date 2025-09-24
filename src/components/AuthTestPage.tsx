// @ts-nocheck
/**
 * Auth Test Page
 * Complete test page for authentication flow with debugging
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CustomAuthRouter from './auth/CustomAuthRouter';

const AuthTestPage = () => {
  const [showDebug, setShowDebug] = useState(true);
  const [authStep, setAuthStep] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-4), `${timestamp}: ${message}`]);
  };

  const handleAuthSuccess = () => {
    addDebugLog('Auth Success - User logged in');
    alert('Authentication successful! (This would normally redirect to main app)');
  };

  const mockCustomAuthRouter = () => {
    switch (authStep) {
      case 'login':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Mock Login Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <Button
                  onClick={() => {
                    addDebugLog('Clicked Sign Up from Login');
                    setAuthStep('register');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Switch to Register
                </Button>
                <Button
                  onClick={() => {
                    addDebugLog('Clicked Forgot Password from Login');
                    setAuthStep('forgot-password');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Switch to Forgot Password
                </Button>
                <Button
                  onClick={() => {
                    addDebugLog('Mock Login Success');
                    handleAuthSuccess();
                  }}
                  className="w-full"
                >
                  Mock Login
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'register':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Mock Register Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <Button
                  onClick={() => {
                    addDebugLog('Clicked Back to Login from Register');
                    setAuthStep('login');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
                <Button
                  onClick={() => {
                    addDebugLog('Mock Registration Success');
                    handleAuthSuccess();
                  }}
                  className="w-full"
                >
                  Mock Register
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'forgot-password':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Mock Forgot Password Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <Button
                  onClick={() => {
                    addDebugLog('Clicked Back to Login from Forgot Password');
                    setAuthStep('login');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
                <Button
                  onClick={() => {
                    addDebugLog('Mock Password Reset Success');
                    setAuthStep('login');
                  }}
                  className="w-full"
                >
                  Mock Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Debug Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Auth Navigation Test
              <Badge variant={showDebug ? "default" : "secondary"}>
                {showDebug ? "Debug Mode" : "Live Mode"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => setShowDebug(!showDebug)}
                variant="outline"
              >
                {showDebug ? "Show Live Auth" : "Show Mock Debug"}
              </Button>
              <Button
                onClick={() => setDebugLogs([])}
                variant="outline"
              >
                Clear Logs
              </Button>
            </div>

            {/* Debug Logs */}
            {debugLogs.length > 0 && (
              <div className="bg-gray-100 p-3 rounded text-sm">
                <h4 className="font-semibold mb-2">Debug Logs:</h4>
                {debugLogs.map((log, index) => (
                  <div key={index} className="text-xs text-gray-600">{log}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auth Component */}
        <div className="flex justify-center">
          {showDebug ? (
            <div className="w-full max-w-md">
              <div className="text-center mb-4">
                <Badge>Current Step: {authStep}</Badge>
              </div>
              {mockCustomAuthRouter()}
            </div>
          ) : (
            <div className="w-full max-w-md">
              <CustomAuthRouter onAuthSuccess={handleAuthSuccess} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;