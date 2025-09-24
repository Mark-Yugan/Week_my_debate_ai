# Database Check Script for DebateWorld AI (PowerShell)
# This script checks if all required database tables and configurations are in place

Write-Host "🔍 Checking Database Configuration..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI is available: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed" -ForegroundColor Red
    Write-Host "Please install it with: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a Supabase project
if (-not (Test-Path "setup\supabase\config.toml")) {
    Write-Host "❌ Not in a Supabase project directory" -ForegroundColor Red
    Write-Host "Please run this script from the project root" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found Supabase configuration" -ForegroundColor Green

# Navigate to the setup directory
Set-Location setup

Write-Host ""
Write-Host "🗄️  Checking Database Status..." -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Check Supabase status
try {
    supabase status
} catch {
    Write-Host "❌ Failed to get Supabase status" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Checking Required Tables..." -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Function to check if a table exists
function Check-Table {
    param($tableName)
    
    Write-Host "Checking table: $tableName" -ForegroundColor Yellow
    
    try {
        $result = supabase db exec "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$tableName');"
        
        if ($result -match "t") {
            Write-Host "✅ Table '$tableName' exists" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Table '$tableName' is missing" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Failed to check table '$tableName'" -ForegroundColor Red
        return $false
    }
}

# Check required tables
$tables = @("profiles", "debate_sessions", "freud_feedback")
$missingTables = 0

foreach ($table in $tables) {
    if (-not (Check-Table $table)) {
        $missingTables++
    }
}

Write-Host ""
Write-Host "🔐 Checking Authentication Configuration..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if auth schema exists
try {
    $authCheck = supabase db exec "SELECT EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = 'auth');"
    
    if ($authCheck -match "t") {
        Write-Host "✅ Auth schema exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Auth schema is missing" -ForegroundColor Red
        $missingTables++
    }
} catch {
    Write-Host "❌ Failed to check auth schema" -ForegroundColor Red
    $missingTables++
}

# Check if the trigger function exists
try {
    $triggerCheck = supabase db exec "SELECT EXISTS (SELECT FROM information_schema.routines WHERE routine_name = 'handle_new_user');"
    
    if ($triggerCheck -match "t") {
        Write-Host "✅ Profile creation trigger function exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Profile creation trigger function is missing" -ForegroundColor Red
        $missingTables++
    }
} catch {
    Write-Host "❌ Failed to check trigger function" -ForegroundColor Red
    $missingTables++
}

Write-Host ""
Write-Host "📧 Checking Email Configuration..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "⚠️  Email configuration must be checked in Supabase dashboard" -ForegroundColor Yellow
Write-Host "   Go to: Authentication > Settings > Email" -ForegroundColor Yellow
Write-Host "   Ensure SMTP is configured or use the built-in service" -ForegroundColor Yellow

Write-Host ""
Write-Host "🌐 Environment Variables..." -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

# Navigate back to root
Set-Location ..

if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "VITE_SUPABASE_URL") {
        Write-Host "✅ VITE_SUPABASE_URL is set" -ForegroundColor Green
    } else {
        Write-Host "❌ VITE_SUPABASE_URL is missing from .env" -ForegroundColor Red
        $missingTables++
    }
    
    if ($envContent -match "VITE_SUPABASE_ANON_KEY") {
        Write-Host "✅ VITE_SUPABASE_ANON_KEY is set" -ForegroundColor Green
    } else {
        Write-Host "❌ VITE_SUPABASE_ANON_KEY is missing from .env" -ForegroundColor Red
        $missingTables++
    }
} else {
    Write-Host "❌ .env file is missing" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and fill in your Supabase credentials" -ForegroundColor Yellow
    $missingTables++
}

Write-Host ""
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan

if ($missingTables -eq 0) {
    Write-Host "🎉 All database checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit http://localhost:8082/debug to run comprehensive tests" -ForegroundColor White
    Write-Host "2. Test user registration and login flows" -ForegroundColor White
    Write-Host "3. Test password reset functionality" -ForegroundColor White
} else {
    Write-Host "❌ Found $missingTables issue(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "To fix issues:" -ForegroundColor Yellow
    Write-Host "1. Run migrations: cd setup; supabase db reset" -ForegroundColor White
    Write-Host "2. Check Supabase dashboard for email configuration" -ForegroundColor White
    Write-Host "3. Ensure .env file has correct credentials" -ForegroundColor White
    Write-Host "4. Visit http://localhost:8082/debug for detailed testing" -ForegroundColor White
}

Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Reset database:           cd setup; supabase db reset" -ForegroundColor White
Write-Host "Run migrations:           cd setup; supabase migration up" -ForegroundColor White
Write-Host "Open Supabase dashboard:  cd setup; supabase dashboard" -ForegroundColor White
Write-Host "Check status:             cd setup; supabase status" -ForegroundColor White
Write-Host "View logs:                cd setup; supabase logs" -ForegroundColor White