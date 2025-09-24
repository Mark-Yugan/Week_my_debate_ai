
import { Button } from '@/components/ui/button';
import LiveDebateSelection from '@/components/LiveDebateSelection';
import CreateCommittee from '@/components/CreateCommittee';
import PricingPage from '@/components/PricingPage';
import Resources from '@/components/Resources';
import ScoresTokens from '@/components/ScoresTokens';
import PublicSpeakingActivities from '@/components/PublicSpeakingActivities';
import DebatesHub from '@/components/DebatesHub';
import HumanDebateRoom from '@/components/HumanDebateRoom';
import DebateHistoryViewer from '@/components/DebateHistoryViewer';
import DebateDetailView from '../DebateDetailView.js';
import InstantDebateSetup from '@/components/InstantDebateSetup';
import InstantDebateRoom from '@/components/InstantDebateRoom';
import ChanakyaDebateSetup from '@/components/ChanakyaDebateSetup';
import ChanakyaDebateRoom from '@/components/ChanakyaDebateRoom';
import AICoach from '@/components/AICoach';
import { ErrorBoundary } from '../ErrorBoundary';

interface UtilityViewsProps {
  currentView: string;
  userTokens: number;
  selectedDebate?: any;
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
    handleLiveDebateFormatSelect: (format: '1v1' | '3v3', language: string) => void;
    handleBackToDashboard: () => void;
    handleViewDebate?: (debate: any) => void;
    handleBackToDebateHistory?: () => void;
    handleInstantDebateStart: (config: any) => void;
    handleInstantDebateBack: () => void;
    handleInstantDebateComplete: (config: any, messages: any[]) => void;
    handleChanakyaDebateStart: (config: any) => void;
    handleChanakyaDebateBack: () => void;
    handleChanakyaDebateComplete: (config: any, messages: any[]) => void;
  };
}

const UtilityViews = ({ currentView, userTokens, selectedDebate, instantDebateConfig, chanakyaDebateConfig, handlers }: UtilityViewsProps) => {
  switch (currentView) {
    case 'ai-coach':
      return <AICoach onBack={handlers.handleBackToDashboard} />;
      
    case 'live-debate-selection':
      return (
        <LiveDebateSelection
          onFormatSelect={handlers.handleLiveDebateFormatSelect}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'create-debate-room':
      return <CreateCommittee onBack={handlers.handleBackToDashboard} />;

    case 'events':
      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎪 Recent Debate Events</h1>
              <p className="text-gray-600 mt-2">Upcoming and recent debate competitions</p>
            </div>
            <Button variant="outline" onClick={handlers.handleBackToDashboard}>
              Back
            </Button>
          </div>
          <div className="text-center text-gray-500 mt-20">
            <p>Events feature coming soon!</p>
          </div>
        </div>
      );

    case 'debates-hub':
      return <DebatesHub onBack={handlers.handleBackToDashboard} />;

    case 'pricing':
      return <PricingPage onBack={handlers.handleBackToDashboard} />;

    case 'resources':
      return <Resources onBack={handlers.handleBackToDashboard} />;

    case 'scores':
      return <ScoresTokens userTokens={userTokens} onBack={handlers.handleBackToDashboard} />;

    case 'public-speaking':
      return <PublicSpeakingActivities onBack={handlers.handleBackToDashboard} />;

    case 'human-debate':
      return (
        <ErrorBoundary>
          <HumanDebateRoom
            topic="Sample Human Debate Topic"
            onExit={handlers.handleBackToDashboard}
          />
        </ErrorBoundary>
      );

    case 'debate-history':
      return (
        <DebateHistoryViewer
          onBack={handlers.handleBackToDashboard}
          onViewDebate={(debate: any) => {
            if (handlers.handleViewDebate) {
              handlers.handleViewDebate(debate);
            }
          }}
        />
      );

    case 'debate-detail':
      return selectedDebate ? (
        <DebateDetailView
          debate={selectedDebate}
          onBack={() => {
            if (handlers.handleBackToDebateHistory) {
              handlers.handleBackToDebateHistory();
            }
          }}
        />
      ) : null;

    case 'instant-debate-setup':
      return (
        <InstantDebateSetup
          onStartDebate={(config) => {
            console.log('Starting instant debate with config:', config);
            handlers.handleInstantDebateStart(config);
          }}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'instant-debate-room':
      return (
        <InstantDebateRoom
          config={instantDebateConfig || {
            topic: 'Sample Topic',
            userPosition: 'for',
            firstSpeaker: 'user'
          }}
          onBack={handlers.handleInstantDebateBack}
          onComplete={(config, messages) => {
            console.log('Instant debate completed:', { config, messages });
            handlers.handleInstantDebateComplete(config, messages);
          }}
        />
      );

    case 'chanakya-debate-setup':
      return (
        <ChanakyaDebateSetup
          onStartDebate={(config) => {
            console.log('Starting Chanakya debate with config:', config);
            handlers.handleChanakyaDebateStart(config);
          }}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'chanakya-debate-room':
      return (
        <ChanakyaDebateRoom
          config={chanakyaDebateConfig || {
            topic: 'Sample Topic',
            topicType: 'custom',
            userPosition: 'for',
            firstSpeaker: 'user',
            difficulty: 'medium'
          }}
          onBack={handlers.handleChanakyaDebateBack}
          onComplete={(config, messages) => {
            console.log('Chanakya debate completed:', { config, messages });
            handlers.handleChanakyaDebateComplete(config, messages);
          }}
        />
      );

    default:
      return null;
  }
};

export default UtilityViews;
