// @ts-nocheck
/**
 * Debug Verification Input Component
 * Simple test for verification code input
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DebugVerificationInput = () => {
  const [code, setCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    console.log('Input changed:', value);
    setCode(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted code:', code);
    alert(`Verification code: ${code}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Debug Verification Input</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Verification Code (Debug)
              </label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={handleInputChange}
                className="text-center text-lg tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current value: "{code}" (Length: {code.length})
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={code.length !== 6}
            >
              Submit Code
            </Button>

            <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
              <strong>Debug Info:</strong>
              <br />
              Value: {code}
              <br />
              Length: {code.length}
              <br />
              Is Valid: {code.length === 6 ? 'Yes' : 'No'}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugVerificationInput;