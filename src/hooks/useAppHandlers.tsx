import { useState } from 'react';
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

interface UseAppHandlersProps {
  setCurrentView: (view: string) => void;
  setSelectedDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  setSelectedTheme: (theme: string) => void;
  setSelectedTopic: (topic: Topic | null) => void;
  setDebateType: (type: 'ai' | '1v1' | 'mun') => void;
  setSelectedCommittee: (committee: MunCommittee | null) => void;
  setSelectedLiveSession: (session: LiveMunSession | null) => void;
  setSelectedProcedureType: (type: 'UNA-USA' | 'Indian Parliamentary' | null) => void;
  setUserTokens: (tokens: number | ((prev: number) => number)) => void;
  setSelectedLanguage: (language: string) => void;
  setSelectedDebateFormat: (format: '1v1' | '3v3') => void;
  setSelectedDebate: (debate: any) => void;
  setInstantDebateConfig: (config: any) => void;
  setChanakyaDebateConfig: (config: any) => void;
}

export const useAppHandlers = ({
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
  setInstantDebateConfig,
  setChanakyaDebateConfig
}: UseAppHandlersProps) => {
  const handleStartDebate = () => {
    setCurrentView('difficulty');
  };

  const handleJoinMUN = () => {
    setCurrentView('mun-mode');
  };

  const handleCreateDebateRoom = () => {
    setCurrentView('create-debate-room');
  };

  const handleViewEvents = () => {
    setCurrentView('events');
  };

  const handleResources = () => {
    setCurrentView('resources');
  };

  const handleViewTokens = () => {
    setCurrentView('scores');
  };

  const handleDifficultySelect = (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => {
    setSelectedDifficulty(difficulty);
    setSelectedTheme(theme);
    setCurrentView('topics');
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('opponents');
  };

  const handleOpponentSelect = (type: 'ai' | '1v1' | 'mun') => {
    setDebateType(type);
    if (type === 'mun') {
      setCurrentView('mun-committees');
    } else {
      setCurrentView('debate');
    }
  };

  const handleCommitteeSelect = (committee: MunCommittee) => {
    setSelectedCommittee(committee);
    setSelectedLiveSession(null);
    setCurrentView('mun');
  };

  const handleJoinLiveSession = (session: LiveMunSession) => {
    setSelectedLiveSession(session);
    setSelectedCommittee(null);
    setCurrentView('mun');
  };

  const handleExitDebate = () => {
    setCurrentView('dashboard');
    setSelectedTopic(null);
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
    // Award tokens after debate completion
    setUserTokens(prev => prev + Math.floor(Math.random() * 15) + 5);
  };

  const handleBackToTopics = () => {
    setCurrentView('topics');
    setSelectedTopic(null);
  };

  const handleBackToDifficulty = () => {
    setCurrentView('difficulty');
    setSelectedTopic(null);
  };

  const handleProcedureSelect = (procedureType: 'UNA-USA' | 'Indian Parliamentary') => {
    setSelectedProcedureType(procedureType);
    setCurrentView('mun-committees');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTopic(null);
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
    setSelectedProcedureType(null);
  };

  const handleBackToCommittees = () => {
    setCurrentView('mun-committees');
    setSelectedCommittee(null);
    setSelectedLiveSession(null);
  };

  const handleLiveDebateFormatSelect = (format: '1v1' | '3v3', language: string) => {
    setSelectedDebateFormat(format);
    setSelectedLanguage(language);
    setDebateType('1v1'); // Set debate type for live debates
    setCurrentView('debate');
  };

  const handleDebateLive = () => {
    setCurrentView('live-debate-selection');
  };

  const handlePublicSpeaking = () => {
    setCurrentView('public-speaking');
  };

  const handleDebatesHub = () => {
    console.log('Navigating to Debates & MUNs Hub');
    setCurrentView('debates-hub');
  };

  const handleHumanDebate = () => {
    console.log('Navigating to Human vs Human Debate');
    setCurrentView('human-debate');
  };

  const handleDebateHistory = () => {
    console.log('Navigating to Debate History');
    setCurrentView('debate-history');
  };

  const handleInstantDebate = () => {
    console.log('Navigating to Instant Debate');
    setCurrentView('instant-debate-setup');
  };

  const handleInstantDebateStart = (config: {
    topic: string;
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    theme?: string;
  }) => {
    console.log('Starting instant debate with config:', config);
    if (setInstantDebateConfig) {
      setInstantDebateConfig(config);
    }
    setCurrentView('instant-debate-room');
  };

  const handleInstantDebateBack = () => {
    console.log('Going back to instant debate setup');
    setCurrentView('instant-debate-setup');
  };

  const handleInstantDebateComplete = (config: {
    topic: string;
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    theme?: string;
  }, messages: Array<{
    id: string;
    speaker: 'user' | 'ai';
    text: string;
    timestamp: Date;
  }>) => {
    console.log('Instant debate completed:', { config, messages });
    // Award tokens for completing debate
    setUserTokens(prev => prev + Math.floor(Math.random() * 10) + 5);
    setCurrentView('dashboard');
  };

  const handleAICoach = () => {
    console.log('Navigating to AI Coach');
    setCurrentView('ai-coach');
  };

  const handleChanakyaDebate = () => {
    console.log('Navigating to Chanakya Debate');
    setCurrentView('chanakya-debate-setup');
  };

  const handleChanakyaDebateStart = (config: {
    topic: string;
    topicType: 'custom' | 'scenario';
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty: 'easy' | 'medium' | 'hard';
    customTopic?: string;
    scenario?: string;
  }) => {
    console.log('Starting Chanakya debate with config:', config);
    setChanakyaDebateConfig(config);
    setCurrentView('chanakya-debate-room');
  };

  const handleChanakyaDebateBack = () => {
    console.log('Going back to Chanakya debate setup');
    setCurrentView('chanakya-debate-setup');
  };

  const handleChanakyaDebateComplete = (config: any, messages: any[]) => {
    console.log('Chanakya debate completed:', { config, messages });
    // Award tokens for completing debate - more tokens for Chanakya debates due to strategic nature
    setUserTokens(prev => prev + Math.floor(Math.random() * 15) + 10);
    setCurrentView('dashboard');
  };

  // New handlers for debate detail view
  const handleViewDebate = (debate: any) => {
    setSelectedDebate(debate);
    setCurrentView('debate-detail');
  };

  const handleBackToDebateHistory = () => {
    setSelectedDebate(null);
    setCurrentView('debate-history');
  };

  return {
    handleStartDebate,
    handleJoinMUN,
    handleCreateDebateRoom,
    handleViewEvents,
    handleResources,
    handleViewTokens,
    handleDifficultySelect,
    handleTopicSelect,
    handleOpponentSelect,
    handleCommitteeSelect,
    handleJoinLiveSession,
    handleExitDebate,
    handleBackToTopics,
    handleBackToDifficulty,
    handleProcedureSelect,
    handleBackToDashboard,
    handleBackToCommittees,
    handleLiveDebateFormatSelect,
    handleDebateLive,
    handlePublicSpeaking,
    handleDebatesHub,
    handleHumanDebate,
    handleDebateHistory,
    handleViewDebate,
    handleBackToDebateHistory,
    handleInstantDebate,
    handleInstantDebateStart,
    handleInstantDebateBack,
    handleInstantDebateComplete,
    handleAICoach,
    handleChanakyaDebate,
    handleChanakyaDebateStart,
    handleChanakyaDebateBack,
    handleChanakyaDebateComplete
  };
};
