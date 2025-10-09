
// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ViewManager from '@/components/ViewManager';
import { useAppHandlers } from '@/hooks/useAppHandlers';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { MunCommittee, LiveMunSession } from '@/data/munCommittees';

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

interface AuthenticatedAppProps {
  isAuthenticated: boolean;
}

const AuthenticatedApp = ({ isAuthenticated }: AuthenticatedAppProps) => {
  const { user, signOut } = useCustomAuth();
  const navigate = useNavigate();
  
  // Use user data from custom auth
  const userRole = (user?.user_role as 'student' | 'teacher') || 'student';
  const userTokens = user?.tokens || 156;
  
  // Function to update user role (placeholder for now)
  const setUserRole = (newRole: 'student' | 'teacher') => {
    // TODO: Implement role update via API
    console.log('Role change requested:', newRole);
  };
  
  // Function to update user tokens (placeholder for now)
  const setUserTokens = (newTokens: number) => {
    // TODO: Implement token update via API
    console.log('Token update requested:', newTokens);
  };
  
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedCommittee, setSelectedCommittee] = useState<MunCommittee | null>(null);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveMunSession | null>(null);
  const [debateType, setDebateType] = useState<'ai' | '1v1' | 'mun'>('ai');
  const [selectedProcedureType, setSelectedProcedureType] = useState<'UNA-USA' | 'Indian Parliamentary' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [selectedDebateFormat, setSelectedDebateFormat] = useState<'1v1' | '3v3'>('1v1');
  const [selectedDebate, setSelectedDebate] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [instantDebateConfig, setInstantDebateConfig] = useState<{
    topic: string;
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    theme?: string;
  } | null>(null);
  const [chanakyaDebateConfig, setChanakyaDebateConfig] = useState<{
    topic: string;
    topicType: 'custom' | 'scenario';
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty: 'easy' | 'medium' | 'hard';
    customTopic?: string;
    scenario?: string;
  } | null>(null);

  // Function to check authentication and redirect to login if needed
  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    callback();
  };

  const handlers = useAppHandlers({
    setCurrentView,
    setSelectedDifficulty,
    setSelectedTheme,
    setSelectedTopic,
    setDebateType,
    setSelectedCommittee,
    setSelectedLiveSession,
    setSelectedProcedureType,
    setUserTokens,
    setSelectedLanguage,
    setSelectedDebateFormat,
    setSelectedDebate,
    setSelectedEvent,
    setInstantDebateConfig,
    setChanakyaDebateConfig
  });

  const handleGetPremium = () => {
    requireAuth(() => setCurrentView('pricing'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        userTokens={userTokens} 
        userRole={userRole} 
        onRoleSwitch={setUserRole}
        onGetPremium={handleGetPremium}
        onSignOut={signOut}
        user={user}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="animate-fade-in">
        <ViewManager
          currentView={currentView}
          userRole={userRole}
          userTokens={userTokens}
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          selectedTheme={selectedTheme}
          selectedCommittee={selectedCommittee}
          selectedLiveSession={selectedLiveSession}
          debateType={debateType}
          selectedProcedureType={selectedProcedureType}
          selectedLanguage={selectedLanguage}
          selectedDebateFormat={selectedDebateFormat}
          selectedDebate={selectedDebate}
          selectedEvent={selectedEvent}
          instantDebateConfig={instantDebateConfig}
          chanakyaDebateConfig={chanakyaDebateConfig}
          handlers={handlers}
          requireAuth={requireAuth}
          isAuthenticated={isAuthenticated}
        />
      </main>
    </div>
  );
};

export default AuthenticatedApp;
