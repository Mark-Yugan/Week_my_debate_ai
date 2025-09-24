// @ts-nocheck
/**
 * Comprehensive Database and Authentication Testing Script
 * This script tests all authentication flows and database connections
 */

import { supabase } from '@/integrations/supabase/client';

export interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
}

export class AuthDatabaseTester {
  private results: TestResult[] = [];

  private addResult(test: string, status: 'PASS' | 'FAIL' | 'WARNING', message: string, details?: any) {
    this.results.push({ test, status, message, details });
    console.log(`[${status}] ${test}: ${message}`, details || '');
  }

  async runAllTests(): Promise<TestResult[]> {
    this.results = [];
    console.log('🧪 Starting comprehensive authentication and database tests...\n');

    // Basic connectivity tests
    await this.testSupabaseConnection();
    await this.testEnvironmentVariables();
    
    // Database schema tests
    await this.testDatabaseSchema();
    await this.testRowLevelSecurity();
    
    // Authentication flow tests
    await this.testUserRegistration();
    await this.testUserLogin();
    await this.testPasswordReset();
    await this.testProfileCreation();
    
    // Email configuration tests
    await this.testEmailConfiguration();
    
    // URL and redirect tests
    await this.testRedirectURLs();

    this.printSummary();
    return this.results;
  }

  private async testSupabaseConnection(): Promise<void> {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        this.addResult('Supabase Connection', 'FAIL', `Connection failed: ${error.message}`, error);
      } else {
        this.addResult('Supabase Connection', 'PASS', 'Successfully connected to Supabase');
      }
    } catch (error) {
      this.addResult('Supabase Connection', 'FAIL', `Connection error: ${error.message}`, error);
    }
  }

  private async testEnvironmentVariables(): Promise<void> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      this.addResult('Environment Variables', 'FAIL', 'VITE_SUPABASE_URL is missing');
      return;
    }

    if (!supabaseKey) {
      this.addResult('Environment Variables', 'FAIL', 'VITE_SUPABASE_ANON_KEY is missing');
      return;
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      this.addResult('Environment Variables', 'FAIL', `Invalid Supabase URL format: ${supabaseUrl}`);
      return;
    }

    // Test if the key is a valid JWT format
    const jwtParts = supabaseKey.split('.');
    if (jwtParts.length !== 3) {
      this.addResult('Environment Variables', 'FAIL', 'Invalid anon key format (not a valid JWT)');
      return;
    }

    this.addResult('Environment Variables', 'PASS', 'All required environment variables are present and valid');
  }

  private async testDatabaseSchema(): Promise<void> {
    try {
      // Test if essential tables exist
      const tables = ['profiles', 'debate_sessions', 'freud_feedback'];
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            this.addResult('Database Schema', 'FAIL', `Table '${table}' is not accessible: ${error.message}`);
          } else {
            this.addResult('Database Schema', 'PASS', `Table '${table}' exists and is accessible`);
          }
        } catch (error) {
          this.addResult('Database Schema', 'FAIL', `Failed to access table '${table}': ${error.message}`);
        }
      }
    } catch (error) {
      this.addResult('Database Schema', 'FAIL', `Schema test failed: ${error.message}`, error);
    }
  }

  private async testRowLevelSecurity(): Promise<void> {
    try {
      // Test RLS without authentication (should fail or return empty)
      const { data, error } = await supabase.from('profiles').select('*');
      
      if (error && error.message.includes('RLS')) {
        this.addResult('Row Level Security', 'PASS', 'RLS is properly enforced');
      } else if (!data || data.length === 0) {
        this.addResult('Row Level Security', 'PASS', 'RLS is working (no data returned without auth)');
      } else {
        this.addResult('Row Level Security', 'WARNING', 'RLS might not be properly configured (data returned without auth)');
      }
    } catch (error) {
      this.addResult('Row Level Security', 'WARNING', `RLS test inconclusive: ${error.message}`);
    }
  }

  private async testUserRegistration(): Promise<void> {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    try {
      // Test user registration
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          this.addResult('User Registration', 'PASS', 'Registration endpoint is working (user already exists)');
        } else if (error.message.includes('email')) {
          this.addResult('User Registration', 'WARNING', `Email configuration issue: ${error.message}`);
        } else {
          this.addResult('User Registration', 'FAIL', `Registration failed: ${error.message}`, error);
        }
      } else {
        this.addResult('User Registration', 'PASS', 'User registration successful', { userId: data.user?.id });
        
        // Clean up test user if possible
        if (data.session) {
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      this.addResult('User Registration', 'FAIL', `Registration test failed: ${error.message}`, error);
    }
  }

  private async testUserLogin(): Promise<void> {
    try {
      // Try to login with invalid credentials (should fail gracefully)
      const { error } = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });

      if (error) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
          this.addResult('User Login', 'PASS', 'Login endpoint is working (properly rejecting invalid credentials)');
        } else {
          this.addResult('User Login', 'WARNING', `Unexpected login error: ${error.message}`);
        }
      } else {
        this.addResult('User Login', 'FAIL', 'Login accepted invalid credentials');
      }
    } catch (error) {
      this.addResult('User Login', 'FAIL', `Login test failed: ${error.message}`, error);
    }
  }

  private async testPasswordReset(): Promise<void> {
    try {
      const testEmail = 'test@example.com';
      const currentOrigin = window.location.origin;
      
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${currentOrigin}/reset-password`,
      });

      if (error) {
        if (error.message.includes('Email rate limit') || error.message.includes('rate')) {
          this.addResult('Password Reset', 'WARNING', 'Password reset rate limited (normal behavior)');
        } else if (error.message.includes('Email not found')) {
          this.addResult('Password Reset', 'PASS', 'Password reset endpoint working (email not found)');
        } else {
          this.addResult('Password Reset', 'FAIL', `Password reset failed: ${error.message}`, error);
        }
      } else {
        this.addResult('Password Reset', 'PASS', 'Password reset email sent successfully');
      }
    } catch (error) {
      this.addResult('Password Reset', 'FAIL', `Password reset test failed: ${error.message}`, error);
    }
  }

  private async testProfileCreation(): Promise<void> {
    try {
      // Test if the profile creation trigger is working
      // This is indirect since we can't easily test triggers without actual user creation
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .limit(1);

      if (error) {
        this.addResult('Profile Creation', 'WARNING', `Profile table access issue: ${error.message}`);
      } else {
        this.addResult('Profile Creation', 'PASS', 'Profile table is accessible and ready for new users');
      }
    } catch (error) {
      this.addResult('Profile Creation', 'FAIL', `Profile creation test failed: ${error.message}`, error);
    }
  }

  private async testEmailConfiguration(): Promise<void> {
    try {
      // Test email configuration by checking auth settings
      const testEmail = 'test-email-config@example.com';
      
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.includes('SMTP') || error.message.includes('email')) {
          this.addResult('Email Configuration', 'FAIL', `Email service not configured: ${error.message}`);
        } else if (error.message.includes('rate limit')) {
          this.addResult('Email Configuration', 'PASS', 'Email service is configured (rate limited response)');
        } else {
          this.addResult('Email Configuration', 'WARNING', `Email test inconclusive: ${error.message}`);
        }
      } else {
        this.addResult('Email Configuration', 'PASS', 'Email service appears to be working');
      }
    } catch (error) {
      this.addResult('Email Configuration', 'FAIL', `Email configuration test failed: ${error.message}`, error);
    }
  }

  private async testRedirectURLs(): Promise<void> {
    const currentOrigin = window.location.origin;
    const expectedRedirects = [
      `${currentOrigin}/`,
      `${currentOrigin}/reset-password`
    ];

    for (const redirectUrl of expectedRedirects) {
      try {
        // Test if the URL is valid
        new URL(redirectUrl);
        this.addResult('Redirect URLs', 'PASS', `Valid redirect URL: ${redirectUrl}`);
      } catch (error) {
        this.addResult('Redirect URLs', 'FAIL', `Invalid redirect URL: ${redirectUrl}`);
      }
    }

    // Check if running on the expected ports
    const currentPort = window.location.port;
    if (currentPort && !['8080', '8081', '8082', '3000', '5173'].includes(currentPort)) {
      this.addResult('Redirect URLs', 'WARNING', `Unusual port detected: ${currentPort}. Ensure Supabase is configured for this port.`);
    }
  }

  private printSummary(): void {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;

    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`📝 Total: ${this.results.length}`);

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`  - ${r.test}: ${r.message}`);
      });
    }

    if (warnings > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.results.filter(r => r.status === 'WARNING').forEach(r => {
        console.log(`  - ${r.test}: ${r.message}`);
      });
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }
}

// Export for use in components
export const runAuthDatabaseTests = async (): Promise<TestResult[]> => {
  const tester = new AuthDatabaseTester();
  return await tester.runAllTests();
};