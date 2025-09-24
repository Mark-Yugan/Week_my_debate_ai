
// @ts-nocheck
import DashboardView from '@/components/views/DashboardView';
import MunModeView from '@/components/views/MunModeView';
import DebateFlowViews from '@/components/views/DebateFlowViews';
import UtilityViews from '@/components/views/UtilityViews';
import MunViews from '@/components/views/MunViews';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  theme: string;
  aiArguments: {
    pro: string[];
    con: string[];
  };
}

interface ViewManagerProps {
  currentView: string;
  userRole: 'student' | 'teacher';
  userTokens: number;
  selectedTopic: Topic | null;
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard';
  selectedTheme: string;
  selectedCommittee: any;
  selectedLiveSession: any;
  selectedDebate?: any;
  debateType: 'ai' | '1v1' | 'mun';
  selectedProcedureType: 'UNA-USA' | 'Indian Parliamentary' | null;
  selectedLanguage: string;
  selectedDebateFormat: '1v1' | '3v3';
  instantDebateConfig: {
    topic: string;
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    theme?: string;
  } | null;
  chanakyaDebateConfig: {
    topic: string;
    topicType: 'custom' | 'scenario';
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty: 'easy' | 'medium' | 'hard';
    customTopic?: string;
    scenario?: string;
  } | null;
  handlers: {
    handleStartDebate: () => void;
    handleDebateLive: () => void;
    handleJoinMUN: () => void;
    handleCreateDebateRoom: () => void;
    handleViewEvents: () => void;
    handleResources: () => void;
    handleViewTokens: () => void;
    handleDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => void;
    handleTopicSelect: (topic: Topic) => void;
    handleOpponentSelect: (type: 'ai' | '1v1' | 'mun') => void;
    handleCommitteeSelect: (committee: any) => void;
    handleJoinLiveSession: (session: any) => void;
    handleExitDebate: () => void;
    handleBackToTopics: () => void;
    handleBackToDifficulty: () => void;
    handleProcedureSelect: (procedureType: 'UNA-USA' | 'Indian Parliamentary') => void;
    handleBackToDashboard: () => void;
    handleBackToCommittees: () => void;
    handleLiveDebateFormatSelect: (format: '1v1' | '3v3', language: string) => void;
    handlePublicSpeaking: () => void;
    handleDebatesHub: () => void;
    handleHumanDebate: () => void;
    handleDebateHistory: () => void;
    handleViewDebate?: (debate: any) => void;
    handleBackToDebateHistory?: () => void;
    handleInstantDebate: () => void;
    handleInstantDebateStart: (config: any) => void;
    handleInstantDebateBack: () => void;
    handleInstantDebateComplete: (config: any, messages: any[]) => void;
    handleChanakyaDebate: () => void;
    handleChanakyaDebateStart: (config: any) => void;
    handleChanakyaDebateBack: () => void;
    handleChanakyaDebateComplete: (config: any, messages: any[]) => void;
  };
  requireAuth?: (callback: () => void) => void;
  isAuthenticated?: boolean;
}

const ViewManager = ({
  currentView,
  userRole,
  userTokens,
  selectedTopic,
  selectedDifficulty,
  selectedTheme,
  selectedCommittee,
  selectedLiveSession,
  selectedDebate,
  debateType,
  selectedProcedureType,
  selectedLanguage,
  selectedDebateFormat,
  instantDebateConfig,
  chanakyaDebateConfig,
  handlers,
  requireAuth,
  isAuthenticated
}: ViewManagerProps) => {
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            userRole={userRole}
            userTokens={userTokens}
            handlers={handlers}
            requireAuth={requireAuth}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'mun-mode':
        return (
          <MunModeView handlers={handlers} />
        );

      case 'difficulty':
      case 'topics':
      case 'opponents':
      case 'debate':
        return (
          <DebateFlowViews
            currentView={currentView}
            selectedTopic={selectedTopic}
            selectedDifficulty={selectedDifficulty}
            selectedTheme={selectedTheme}
            debateType={debateType}
            selectedLanguage={selectedLanguage}
            handlers={handlers}
          />
        );

      case 'procedure-selection':
      case 'mun-committees':
      case 'mun':
        return (
          <MunViews
            currentView={currentView}
            selectedCommittee={selectedCommittee}
            selectedLiveSession={selectedLiveSession}
            handlers={handlers}
          />
        );

      case 'live-debate-selection':
      case 'create-debate-room':
      case 'events':
      case 'debates-hub':
      case 'pricing':
      case 'resources':
      case 'scores':
      case 'public-speaking':
      case 'human-debate':
      case 'debate-history':
      case 'debate-detail':
      case 'instant-debate-setup':
      case 'instant-debate-room':
      case 'instant-debate-evaluation':
      case 'debate-history-viewer':
      case 'instant-debate-viewer':
      case 'chanakya-debate-setup':
      case 'chanakya-debate-room':
      case 'ai-coach':
        return (
          <UtilityViews
            currentView={currentView}
            userTokens={userTokens}
            selectedDebate={selectedDebate}
            instantDebateConfig={instantDebateConfig}
            chanakyaDebateConfig={chanakyaDebateConfig}
            handlers={handlers}
          />
        );

      default:
        return null;
    }
  };

  return renderView();
};

export default ViewManager;
