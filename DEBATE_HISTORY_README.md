# Debate History System

A comprehensive debate history tracking system for the Debate World AI application using Supabase as the backend database.

## 🎯 Features

- **Complete Debate Tracking**: Store all debate sessions with metadata (topic, difficulty, positions, etc.)
- **Message History**: Track every user and AI message with timestamps and metadata
- **User Statistics**: Generate comprehensive stats about user's debate performance
- **Search & Filter**: Search debates by topic and filter by status/difficulty
- **Real-time Updates**: Live tracking of debate progress
- **Secure Access**: Row-level security ensures users only see their own data

## 📊 Database Schema

### Tables

#### `debate_sessions`
Stores metadata for each debate session:
- `id` - Unique session identifier
- `user_id` - User who created the debate
- `topic` - The debate topic/scenario
- `topic_type` - Either 'custom' or 'scenario'
- `user_position` - User's stance ('for' or 'against')
- `first_speaker` - Who opens ('user' or 'ai')
- `difficulty` - AI difficulty level ('easy', 'medium', 'hard')
- `status` - Session status ('active', 'completed', 'abandoned')
- `total_turns` - Number of turns taken
- `session_duration` - Total session time in seconds
- `metadata` - Additional JSON data

#### `debate_messages`
Stores individual messages/turns:
- `id` - Unique message identifier
- `debate_session_id` - References the debate session
- `speaker` - Who sent the message ('user' or 'ai')
- `message_text` - The actual message content
- `turn_number` - Order in the debate
- `processing_time` - AI response time (if applicable)
- `confidence_score` - AI confidence level (0-100)
- `relevance_score` - Message relevance ('high', 'medium', 'low')
- `message_type` - Type of message ('debate_turn', 'opening_statement', etc.)

#### `debate_session_summaries` (View)
Provides aggregated session data for easier querying and display.

## 🚀 Setup Instructions

### 1. Database Migration

Run the migration to create the necessary tables:

**Windows:**
```bash
setup\migrate-debate-history.bat
```

**Linux/Mac:**
```bash
chmod +x setup/migrate-debate-history.sh
./setup/migrate-debate-history.sh
```

**Manual Migration:**
```bash
supabase db push
```

### 2. Environment Setup

Ensure your Supabase client is properly configured in your application.

## 💻 Usage

### Creating a Debate Session

```typescript
import { DebateHistoryService } from '@/services/debate-history';

const session = await DebateHistoryService.createDebateSession({
  topic: "AI will replace human creativity",
  topic_type: 'custom',
  user_position: 'for',
  first_speaker: 'user',
  difficulty: 'medium'
});
```

### Adding Messages

```typescript
const message = await DebateHistoryService.addDebateMessage({
  debate_session_id: session.id,
  speaker: 'user',
  message_text: "I believe AI enhances rather than replaces creativity...",
  turn_number: 1,
  message_type: 'opening_statement'
});
```

### Fetching Debate History

```typescript
const history = await DebateHistoryService.getDebateHistory(1, 10); // page 1, 10 items
```

### Using React Hooks

```typescript
import { useDebateHistory, useCreateDebateSession } from '@/hooks/useDebateHistory';

function MyComponent() {
  const { sessions, loading, error } = useDebateHistory();
  const { createSession } = useCreateDebateSession();
  
  // Use the hooks in your component
}
```

## 🔧 Components

### DebateHistoryViewer
A complete React component for viewing and managing debate history:

```typescript
import { DebateHistoryViewer } from '@/components/DebateHistoryViewer_New';

<DebateHistoryViewer 
  onViewSession={(sessionId) => {
    // Handle viewing a specific session
  }}
/>
```

### Enhanced ChanakyaDebateRoom
The debate room component now automatically tracks all debate activity:

```typescript
import ChanakyaDebateRoom from '@/components/ChanakyaDebateRoom_WithHistory';

<ChanakyaDebateRoom 
  config={debateConfig}
  onBack={() => {}}
  onComplete={(config, messages) => {
    // Debate completed - data already saved to database
  }}
/>
```

## 📈 Statistics Available

The system provides comprehensive statistics:

- **Total Debates**: Number of debates started
- **Completed Debates**: Successfully finished debates  
- **Active Debates**: Currently ongoing debates
- **Total Turns**: All debate turns across sessions
- **Average Session Duration**: Time spent debating
- **Favorite Difficulty**: Most used difficulty level
- **Debates by Difficulty**: Breakdown by difficulty level

## 🔒 Security

- **Row Level Security (RLS)**: Users can only access their own debate data
- **Authentication Required**: All operations require valid user authentication
- **Secure Policies**: Comprehensive policies for read/write access

## 🛠 API Reference

### DebateHistoryService

- `createDebateSession(input)` - Create a new debate session
- `addDebateMessage(input)` - Add a message to a session
- `getDebateHistory(page, limit)` - Get paginated debate history
- `getDebateSession(sessionId)` - Get a specific session with messages
- `updateSessionStatus(sessionId, status, duration?)` - Update session status
- `getUserDebateStats()` - Get user statistics
- `deleteDebateSession(sessionId)` - Delete a session
- `searchDebateSessions(searchTerm, page, limit)` - Search debates

### React Hooks

- `useDebateHistory()` - Manage debate history list
- `useDebateSession(sessionId)` - Get specific session data
- `useDebateStats()` - Get user statistics
- `useCreateDebateSession()` - Create new sessions
- `useAddDebateMessage()` - Add messages to sessions

## 🎨 UI Components

The system includes beautiful, modern UI components:

- **Statistics Cards**: Visual representation of user stats
- **Search & Filter**: Find debates quickly
- **Session Cards**: Rich display of debate sessions
- **Status Badges**: Color-coded status indicators
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Matches your app's theme

## 📱 Integration

The debate history system seamlessly integrates with:

- **ChanakyaDebateSetup**: Automatically creates sessions
- **ChanakyaDebateRoom**: Tracks all messages and turns
- **User Dashboard**: Display statistics and recent debates
- **Navigation**: Access history from anywhere in the app

## 🔄 Data Flow

1. **Session Creation**: When user starts a debate, a session is created
2. **Message Tracking**: Every user and AI message is stored
3. **Status Updates**: Session status updated as debate progresses
4. **Statistics**: Real-time calculation of user statistics
5. **History Access**: Users can view and manage their debate history

## 🎉 Benefits

- **Complete Audit Trail**: Never lose a debate again
- **Performance Tracking**: See improvement over time
- **Topic Management**: Find and revisit interesting debates
- **Learning Tool**: Analyze past arguments and responses
- **User Engagement**: Gamification through statistics

This system provides a robust foundation for tracking and analyzing debate performance, helping users improve their argumentation skills over time!
