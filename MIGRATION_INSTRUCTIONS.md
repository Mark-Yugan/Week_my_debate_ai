# Manual Migration Instructions for Debate History

## Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI:**
   ```powershell
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```powershell
   supabase login
   ```

3. **Link your project:**
   ```powershell
   supabase link --project-ref dynelmjgdqjzwtrpxttx
   ```

4. **Run the migration:**
   ```powershell
   supabase db push
   ```

## Option 2: Manual SQL Execution

1. **Go to your Supabase SQL Editor:**
   - Visit: https://supabase.com/dashboard/project/dynelmjgdqjzwtrpxttx/sql

2. **Copy the SQL from this file:**
   - `setup\supabase\migrations\20250912000001_create_debate_history_tables.sql`

3. **Paste and execute the SQL in the Supabase dashboard**

## What this migration creates:

### Tables:
- `debate_sessions` - Stores each debate session with metadata
- `debate_messages` - Stores individual messages within debates

### Features:
- Row Level Security (RLS) policies
- Automatic timestamping
- User-specific data access
- Debate statistics function
- Search and filtering capabilities

### Functions:
- `get_user_debate_statistics()` - Returns comprehensive debate stats

## After migration:

The debate history system will automatically start tracking:
- All debate sessions (topic, difficulty, language, etc.)
- Individual messages (user responses, AI responses)
- Session statistics and analytics
- Historical performance data

## Testing:

1. Start a new debate in ChanakyaDebateRoom
2. Check that session is created in `debate_sessions` table
3. Verify messages are stored in `debate_messages` table
4. Test the history viewer component

## Troubleshooting:

If you encounter any issues:
1. Check Supabase project permissions
2. Verify authentication is working
3. Check browser console for errors
4. Ensure RLS policies are active
