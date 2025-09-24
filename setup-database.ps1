# ==================================================
# DATABASE SETUP INSTRUCTIONS
# ==================================================

Write-Host "=== CUSTOM AUTHENTICATION DATABASE SETUP ===" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 1: Go to your Supabase Dashboard" -ForegroundColor Yellow
Write-Host "- Open your browser and go to supabase.com"
Write-Host "- Navigate to your project"
Write-Host "- Go to 'SQL Editor' in the left sidebar"
Write-Host ""

Write-Host "STEP 2: Execute Database Schema" -ForegroundColor Yellow
Write-Host "- Copy the contents of 'database-quick-fix.sql'"
Write-Host "- Paste it into the SQL Editor"
Write-Host "- Click 'Run' to execute"
Write-Host ""

Write-Host "STEP 3: Execute Database Functions" -ForegroundColor Yellow
Write-Host "- Copy the contents of 'database-functions.sql'"
Write-Host "- Paste it into the SQL Editor"
Write-Host "- Click 'Run' to execute"
Write-Host ""

Write-Host "STEP 4: Verify Installation" -ForegroundColor Yellow
Write-Host "- Run this query to check tables:"
Write-Host "  SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%user%';"
Write-Host ""
Write-Host "- Run this query to check functions:"
Write-Host "  SELECT proname FROM pg_proc WHERE proname LIKE '%user%';"
Write-Host ""

Write-Host "=== TROUBLESHOOTING ===" -ForegroundColor Red
Write-Host ""
Write-Host "If you see errors about missing extensions, run this first:"
Write-Host "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
Write-Host ""
Write-Host "If you see permission errors, make sure you're logged in as the project owner."
Write-Host ""

Write-Host "=== AFTER DATABASE SETUP ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Go back to your application at http://localhost:8082/auth"
Write-Host "2. Try the registration flow"
Write-Host "3. Check the browser console for any remaining errors"
Write-Host ""

Write-Host "Press any key to open the database files in explorer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open the directory with the database files
Start-Process "explorer.exe" -ArgumentList (Get-Location).Path