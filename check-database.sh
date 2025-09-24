#!/bin/bash

# Database Check Script for DebateWorld AI
# This script checks if all required database tables and configurations are in place

echo "🔍 Checking Database Configuration..."
echo "=================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "Please install it with: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI is available"

# Check if we're in a Supabase project
if [ ! -f "setup/supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory"
    echo "Please run this script from the project root"
    exit 1
fi

echo "✅ Found Supabase configuration"

# Navigate to the setup directory
cd setup

echo ""
echo "🗄️  Checking Database Status..."
echo "==============================="

# Check Supabase status
supabase status

echo ""
echo "📋 Checking Required Tables..."
echo "============================="

# Function to check if a table exists
check_table() {
    local table_name=$1
    echo "Checking table: $table_name"
    
    result=$(supabase db exec "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table_name');" 2>/dev/null)
    
    if [[ $result == *"t"* ]]; then
        echo "✅ Table '$table_name' exists"
    else
        echo "❌ Table '$table_name' is missing"
        return 1
    fi
}

# Check required tables
tables=("profiles" "debate_sessions" "freud_feedback")
missing_tables=0

for table in "${tables[@]}"; do
    if ! check_table "$table"; then
        ((missing_tables++))
    fi
done

echo ""
echo "🔐 Checking Authentication Configuration..."
echo "========================================="

# Check if auth schema exists
auth_check=$(supabase db exec "SELECT EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = 'auth');" 2>/dev/null)

if [[ $auth_check == *"t"* ]]; then
    echo "✅ Auth schema exists"
else
    echo "❌ Auth schema is missing"
    ((missing_tables++))
fi

# Check if the trigger function exists
trigger_check=$(supabase db exec "SELECT EXISTS (SELECT FROM information_schema.routines WHERE routine_name = 'handle_new_user');" 2>/dev/null)

if [[ $trigger_check == *"t"* ]]; then
    echo "✅ Profile creation trigger function exists"
else
    echo "❌ Profile creation trigger function is missing"
    ((missing_tables++))
fi

echo ""
echo "📧 Checking Email Configuration..."
echo "================================"

# Check auth configuration (this requires a more complex query)
echo "⚠️  Email configuration must be checked in Supabase dashboard"
echo "   Go to: Authentication > Settings > Email"
echo "   Ensure SMTP is configured or use the built-in service"

echo ""
echo "🌐 Environment Variables..."
echo "=========================="

# Navigate back to root
cd ..

if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    if grep -q "VITE_SUPABASE_URL" .env; then
        echo "✅ VITE_SUPABASE_URL is set"
    else
        echo "❌ VITE_SUPABASE_URL is missing from .env"
        ((missing_tables++))
    fi
    
    if grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo "✅ VITE_SUPABASE_ANON_KEY is set"
    else
        echo "❌ VITE_SUPABASE_ANON_KEY is missing from .env"
        ((missing_tables++))
    fi
else
    echo "❌ .env file is missing"
    echo "Please copy .env.example to .env and fill in your Supabase credentials"
    ((missing_tables++))
fi

echo ""
echo "📊 Summary"
echo "=========="

if [ $missing_tables -eq 0 ]; then
    echo "🎉 All database checks passed!"
    echo ""
    echo "Next steps:"
    echo "1. Visit http://localhost:8082/debug to run comprehensive tests"
    echo "2. Test user registration and login flows"
    echo "3. Test password reset functionality"
else
    echo "❌ Found $missing_tables issue(s)"
    echo ""
    echo "To fix issues:"
    echo "1. Run migrations: supabase db reset"
    echo "2. Check Supabase dashboard for email configuration"
    echo "3. Ensure .env file has correct credentials"
    echo "4. Visit http://localhost:8082/debug for detailed testing"
fi

echo ""
echo "🔗 Useful Commands:"
echo "=================="
echo "Reset database:           cd setup && supabase db reset"
echo "Run migrations:           cd setup && supabase migration up"
echo "Open Supabase dashboard:  cd setup && supabase dashboard"
echo "Check status:             cd setup && supabase status"
echo "View logs:                cd setup && supabase logs"