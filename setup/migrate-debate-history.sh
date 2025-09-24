#!/bin/bash

# Supabase Migration Script for Debate History Tables
# Run this script to create the debate history tables in your Supabase database

echo "🚀 Starting Supabase migration for debate history tables..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Check if we're in a Supabase project
if [ ! -f "setup/supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory. Please run this from your project root."
    exit 1
fi

echo "📋 Project found. Applying migration..."

# Apply the migration
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Migration applied successfully!"
    echo ""
    echo "📊 Debate history tables created:"
    echo "   - debate_sessions (stores debate metadata)"
    echo "   - debate_messages (stores individual messages/turns)"
    echo "   - debate_session_summaries (view for session summaries)"
    echo ""
    echo "🔒 Row Level Security (RLS) enabled with user-based policies"
    echo "🔧 Helper functions and triggers created"
    echo ""
    echo "🎉 Your debate history system is ready to use!"
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi
