
// @ts-nocheck
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';

interface DashboardViewProps {
  userRole: 'student' | 'teacher';
  userTokens: number;
  handlers: {
    handleStartDebate: () => void;
    handleDebateLive: () => void;
    handleJoinMUN: () => void;
    handleCreateDebateRoom: () => void;
    handleViewEvents: () => void;
    handleResources: () => void;
    handleViewTokens: () => void;
    handlePublicSpeaking: () => void;
    handleDebatesHub: () => void;
    handleHumanDebate: () => void;
    handleDebateHistory: () => void;
    handleInstantDebate: () => void;
    handleAICoach: () => void;
    handleChanakyaDebate: () => void;
  };
  requireAuth?: (callback: () => void) => void;
  isAuthenticated?: boolean;
}

const DashboardView = ({ userRole, userTokens, handlers, requireAuth, isAuthenticated }: DashboardViewProps) => {
  return userRole === 'student' ? (
    <StudentDashboard 
      userTokens={userTokens} 
      onStartDebate={handlers.handleStartDebate}
      onDebateLive={handlers.handleDebateLive}
      onJoinMUN={handlers.handleJoinMUN}
      onCreateDebateRoom={handlers.handleCreateDebateRoom}
      onViewEvents={handlers.handleViewEvents}
      onResources={handlers.handleResources}
      onViewTokens={handlers.handleViewTokens}
      onPublicSpeaking={handlers.handlePublicSpeaking}
      onDebatesHub={handlers.handleDebatesHub}
      onHumanDebate={handlers.handleHumanDebate}
      onDebateHistory={handlers.handleDebateHistory}
      onInstantDebate={handlers.handleInstantDebate}
      onAICoach={handlers.handleAICoach}
      onChanakyaDebate={handlers.handleChanakyaDebate}
      requireAuth={requireAuth}
      isAuthenticated={isAuthenticated}
    />
  ) : (
    <TeacherDashboard />
  );
};

export default DashboardView;
