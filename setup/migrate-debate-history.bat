@echo off
REM Supabase Migration Script for Debate History Tables
REM Run this script to create the debate history tables in your Supabase database

echo 🚀 Starting Supabase migration for debate history tables...

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Supabase CLI is not installed. Please install it first:
    echo    npm install -g supabase
    pause
    exit /b 1
)

REM Navigate to the project directory
cd /d "%~dp0\.."

REM Check if we're in a Supabase project
if not exist "setup\supabase\config.toml" (
    echo ❌ Not in a Supabase project directory. Please run this from your project root.
    pause
    exit /b 1
)

echo 📋 Project found. Applying migration...

REM Apply the migration
supabase db push

if %ERRORLEVEL% EQU 0 (
    echo ✅ Migration applied successfully!
    echo.
    echo 📊 Debate history tables created:
    echo    - debate_sessions ^(stores debate metadata^)
    echo    - debate_messages ^(stores individual messages/turns^)
    echo    - debate_session_summaries ^(view for session summaries^)
    echo.
    echo 🔒 Row Level Security ^(RLS^) enabled with user-based policies
    echo 🔧 Helper functions and triggers created
    echo.
    echo 🎉 Your debate history system is ready to use!
) else (
    echo ❌ Migration failed. Please check the error messages above.
)

pause
