// @ts-nocheck
/**
 * Simple Verification Test
 * Basic controlled input test for verification
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SimpleVerificationTest = () => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Code entered: ${code}`);
  };

  console.log('Current code state:', code);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Simple Verification Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Enter 6-digit code:
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  console.log('Raw input:', e.target.value);
                  const filtered = e.target.value.replace(/\D/g, '').slice(0, 6);
                  console.log('Filtered:', filtered);
                  setCode(filtered);
                }}
                className="text-center text-lg tracking-widest"
                maxLength={6}
                autoComplete="off"
                autoFocus
                inputMode="numeric"
              />
              <p className="text-xs text-gray-500">
                Current: "{code}" (Length: {code.length})
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={code.length !== 6}
            >
              Submit ({code.length}/6)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleVerificationTest;