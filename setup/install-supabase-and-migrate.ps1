# PowerShell script to install Supabase CLI and run migration

Write-Host "🚀 Setting up Supabase CLI and running debate history migration..." -ForegroundColor Cyan

# Check if Node.js is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to continue..."
    exit 1
}

# Check if npm is available
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not available. Please ensure Node.js is properly installed." -ForegroundColor Red
    Read-Host "Press Enter to continue..."
    exit 1
}

Write-Host "📦 Installing Supabase CLI..." -ForegroundColor Yellow
npm install -g supabase

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Supabase CLI installed successfully!" -ForegroundColor Green
    
    Write-Host "🔗 Please follow these steps:" -ForegroundColor Cyan
    Write-Host "1. Login to Supabase: supabase login" -ForegroundColor White
    Write-Host "2. Link your project: supabase link --project-ref dynelmjgdqjzwtrpxttx" -ForegroundColor White
    Write-Host "3. Run the migration: supabase db push" -ForegroundColor White
    Write-Host ""
    Write-Host "Or you can manually run the SQL file in your Supabase dashboard:" -ForegroundColor Yellow
    Write-Host "- Go to https://supabase.com/dashboard/project/dynelmjgdqjzwtrpxttx/sql" -ForegroundColor White
    Write-Host "- Copy and paste the contents of:" -ForegroundColor White
    Write-Host "  setup\supabase\migrations\20250912000001_create_debate_history_tables.sql" -ForegroundColor White
    Write-Host "- Execute the SQL" -ForegroundColor White
} else {
    Write-Host "❌ Failed to install Supabase CLI. You can manually run the SQL migration:" -ForegroundColor Red
    Write-Host "1. Go to https://supabase.com/dashboard/project/dynelmjgdqjzwtrpxttx/sql" -ForegroundColor White
    Write-Host "2. Copy and paste the contents of the SQL file" -ForegroundColor White
    Write-Host "3. Execute the SQL" -ForegroundColor White
}

Write-Host ""
Write-Host "📄 SQL file location: setup\supabase\migrations\20250912000001_create_debate_history_tables.sql" -ForegroundColor Cyan

Read-Host "Press Enter to continue..."
