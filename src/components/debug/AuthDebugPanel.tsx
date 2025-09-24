// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, PlayCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { runAuthDatabaseTests, TestResult } from '@/utils/authDatabaseTester';

const AuthDebugPanel = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await runAuthDatabaseTests();
      setTestResults(results);
    } catch (error) {
      console.error('Failed to run tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleTestExpansion = (testName: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testName)) {
      newExpanded.delete(testName);
    } else {
      newExpanded.add(testName);
    }
    setExpandedTests(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAIL':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'PASS' ? 'default' : status === 'FAIL' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  const groupedResults = testResults.reduce((acc, result) => {
    const category = result.test.split(' ')[0];
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  const getSummaryStats = () => {
    const passed = testResults.filter(r => r.status === 'PASS').length;
    const failed = testResults.filter(r => r.status === 'FAIL').length;
    const warnings = testResults.filter(r => r.status === 'WARNING').length;
    return { passed, failed, warnings, total: testResults.length };
  };

  const stats = getSummaryStats();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Authentication & Database Debug Panel
          </CardTitle>
          <CardDescription>
            Test all authentication flows and database connections to diagnose issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>

            {testResults.length > 0 && (
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedResults).map(([category, results]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category} Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <Collapsible key={`${result.test}-${index}`}>
                  <CollapsibleTrigger
                    className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => toggleTestExpansion(result.test)}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                      {getStatusBadge(result.status)}
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedTests.has(result.test) ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="pt-3">
                    <div className="bg-white border rounded-lg p-4 ml-7">
                      <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                      
                      {result.details && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Details:</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {result.status === 'FAIL' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <h4 className="text-sm font-medium text-red-800 mb-1">Suggested Actions:</h4>
                          <ul className="text-xs text-red-700 space-y-1">
                            {getSuggestedActions(result.test, result.message).map((action, i) => (
                              <li key={i}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Current URL:</strong> {window.location.href}
              </div>
              <div>
                <strong>Origin:</strong> {window.location.origin}
              </div>
              <div>
                <strong>Port:</strong> {window.location.port || 'default'}
              </div>
              <div>
                <strong>Protocol:</strong> {window.location.protocol}
              </div>
              <div>
                <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}
              </div>
              <div>
                <strong>Anon Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const getSuggestedActions = (testName: string, message: string): string[] => {
  const actions: string[] = [];

  if (testName.includes('Connection') || testName.includes('Environment')) {
    actions.push('Check your .env file for correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    actions.push('Ensure Supabase project is active and accessible');
    actions.push('Verify network connectivity');
  }

  if (testName.includes('Registration')) {
    actions.push('Check if email confirmation is required in Supabase settings');
    actions.push('Verify user registration is enabled in Authentication settings');
    actions.push('Check if the profiles table exists and has proper triggers');
  }

  if (testName.includes('Password Reset') || testName.includes('Email')) {
    actions.push('Configure SMTP settings in Supabase Authentication');
    actions.push('Check email template settings');
    actions.push('Verify redirect URLs are configured in Authentication settings');
  }

  if (testName.includes('Schema') || testName.includes('Database')) {
    actions.push('Run database migrations: npm run db:migrate');
    actions.push('Check if all required tables exist');
    actions.push('Verify table permissions and RLS policies');
  }

  if (testName.includes('Redirect')) {
    actions.push('Add current URL to Site URL in Supabase Authentication settings');
    actions.push('Configure redirect URLs in Authentication settings');
  }

  if (actions.length === 0) {
    actions.push('Check browser console for additional error details');
    actions.push('Review Supabase logs in the dashboard');
    actions.push('Verify authentication settings in Supabase');
  }

  return actions;
};

export default AuthDebugPanel;