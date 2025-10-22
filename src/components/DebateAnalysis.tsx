import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DebateAnalysisData } from '@/types/debate-history';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Brain, 
  MessageSquare, 
  Star, 
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BarChart3,
  PieChart,
  Award,
  BookOpen,
  Zap,
  Eye,
  Clock,
  Users,
  ChevronRight,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

interface ActionItem {
  action: string;
  description: string;
  timeframe: string;
}

interface DebateAnalysisProps {
  analysisData: DebateAnalysisData;
  onBack?: () => void;
  onContinue?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  onRetakeDebate?: () => void;
  onShareResults?: () => void;
  debateContext?: {
    topic: string;
    duration: number;
    difficulty: string;
  };
}

const DebateAnalysis: React.FC<DebateAnalysisProps> = ({
  analysisData,
  onBack,
  onContinue,
  onClose,
  isLoading,
  onRetakeDebate,
  onShareResults,
  debateContext
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Safely handle data structure - support both old and new formats
  const safeAnalysisData = Array.isArray(analysisData) ? analysisData[0] : analysisData;
  
  // If no analysis data, show error state
  if (!safeAnalysisData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Analysis Data</h2>
          <p className="text-gray-400 mb-4">Unable to load analysis data for this session.</p>
          {onBack && (
            <Button onClick={onBack} className="btn-neon-primary">
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50';
    if (score >= 70) return 'bg-cyan-400/20 text-cyan-300 border-cyan-400/50';
    if (score >= 60) return 'bg-amber-400/20 text-amber-300 border-amber-400/50';
    return 'bg-rose-400/20 text-rose-300 border-rose-400/50';
  };

  const renderImprovementItem = (item: string | ActionItem, index: number) => {
    if (typeof item === 'string') {
      // Handle simple string format
      return (
        <div key={index} className="flex items-start space-x-2">
          <ChevronRight className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-300">{item}</span>
        </div>
      );
    } else {
      // Handle object format {action, description, timeframe}
      return (
        <div key={index} className="flex items-start space-x-2">
          <ChevronRight className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-white">{item.action}</div>
            <div className="text-xs text-gray-400 mt-1">{item.description}</div>
            <div className="text-xs text-cyan-400 mt-1">{item.timeframe}</div>
          </div>
        </div>
      );
    }
  };

  const metrics = [
    { key: 'argumentation', label: 'Argumentation', icon: Brain, data: safeAnalysisData.performanceMetrics?.argumentation },
    { key: 'clarity', label: 'Clarity', icon: Eye, data: safeAnalysisData.performanceMetrics?.clarity },
    { key: 'engagement', label: 'Engagement', icon: Users, data: safeAnalysisData.performanceMetrics?.engagement },
    { key: 'criticalThinking', label: 'Critical Thinking', icon: Target, data: safeAnalysisData.performanceMetrics?.criticalThinking },
    { key: 'communication', label: 'Communication', icon: MessageSquare, data: safeAnalysisData.performanceMetrics?.communication }
  ].filter(metric => metric.data); // Filter out any undefined metrics

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-gray-950 to-fuchsia-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button 
                  onClick={onBack}
                  className="p-2 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="p-3 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-xl shadow-neon">
                <BarChart3 className="h-8 w-8 text-gray-950" />
              </div>
              <div>
                <h1 className="text-4xl font-bold font-orbitron neon-text">
                  Debate Analysis
                </h1>
                <p className="text-gray-300 mt-1">
                  {debateContext?.topic && `Topic: ${debateContext.topic}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {onShareResults && (
                <Button 
                  onClick={onShareResults}
                  className="btn-neon-secondary flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              )}
              <Button 
                onClick={onContinue || onClose}
                className="btn-neon-primary"
              >
                Continue
              </Button>
            </div>
          </div>

          {/* Overall Score Card */}
          <div className="card-neon p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className={`text-6xl font-bold font-orbitron ${getScoreColor(safeAnalysisData.overallScore || 0)}`}>
                    {safeAnalysisData.overallScore || 0}
                  </div>
                  <div className="text-sm text-gray-400 text-center mt-1">Overall Score</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span className="text-white font-medium">
                      {safeAnalysisData.motivationalInsights?.progressHighlights || "Great job completing the debate!"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-cyan-400" />
                    <span className="text-gray-300">
                      {safeAnalysisData.motivationalInsights?.confidenceBuilders || "Your participation shows commitment to improvement"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className={`text-lg px-4 py-2 ${getScoreBadgeColor(safeAnalysisData.overallScore || 0)}`}>
                  {(safeAnalysisData.overallScore || 0) >= 85 ? 'Excellent' : 
                   (safeAnalysisData.overallScore || 0) >= 70 ? 'Good' : 
                   (safeAnalysisData.overallScore || 0) >= 60 ? 'Fair' : 'Needs Work'}
                </Badge>
                {debateContext && (
                  <div className="text-sm text-gray-400 mt-2">
                    {debateContext.duration > 0 && `Duration: ${Math.floor(debateContext.duration / 60)}:${(debateContext.duration % 60).toString().padStart(2, '0')}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-gray-800/50 border border-cyan-400/20 mb-8">
            <TabsTrigger value="overview" className="flex items-center space-x-2 h-12">
              <PieChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center space-x-2 h-12">
              <Target className="h-4 w-4" />
              <span>Detailed Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center space-x-2 h-12">
              <Lightbulb className="h-4 w-4" />
              <span>Specific Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="improvement" className="flex items-center space-x-2 h-12">
              <TrendingUp className="h-4 w-4" />
              <span>Improvement Plan</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="card-neon">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                    <span>Performance Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metrics.map(({ key, label, icon: Icon, data }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-cyan-400" />
                          <span className="text-white font-medium">{label}</span>
                        </div>
                        <span className={`font-bold ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </span>
                      </div>
                      <Progress value={data.score} className="h-2 bg-gray-800" />
                    </div>
                  ))}
                </CardContent>
              </div>

              {/* Key Insights */}
              <div className="space-y-6">
                {/* Strengths */}
                <div className="card-neon">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span>Key Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(safeAnalysisData.keyStrengths || []).map((strength: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <ArrowUp className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>

                {/* Areas for Improvement */}
                <div className="card-neon">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                      <span>Growth Opportunities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(safeAnalysisData.areasForImprovement || []).map((area: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics.map(({ key, label, icon: Icon, data }) => {
                if (!data) return null; // Skip if data is undefined
                
                return (
                <div key={key} className="card-neon">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-cyan-400" />
                        <span className="text-white">{label}</span>
                      </div>
                      <Badge className={`${getScoreBadgeColor(data.score || 0)}`}>
                        {data.score || 0}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={data.score || 0} className="h-3 bg-gray-800" />
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-emerald-400 font-medium mb-2 flex items-center space-x-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Strengths</span>
                        </h4>
                        <ul className="space-y-1">
                          {(data.strengths || []).map((strength, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-amber-400 font-medium mb-2 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>Areas to Develop</span>
                        </h4>
                        <ul className="space-y-1">
                          {(data.weaknesses || []).map((weakness, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-3">
                        <h4 className="text-cyan-400 font-medium mb-2 flex items-center space-x-1">
                          <Lightbulb className="h-4 w-4" />
                          <span>Improvement Suggestion</span>
                        </h4>
                        <p className="text-sm text-gray-300">{data.improvement || "Continue practicing to improve"}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Specific Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(safeAnalysisData.specificFeedback || {}).map(([key, feedback]: [string, any]) => (
                <div key={key} className="card-neon">
                  <CardHeader>
                    <CardTitle className="text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-cyan-400 font-medium mb-2">Analysis</h4>
                      <p className="text-gray-300 text-sm">{feedback.analysis}</p>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <h4 className="text-emerald-400 font-medium mb-2 flex items-center space-x-1">
                        <Lightbulb className="h-4 w-4" />
                        <span>Suggestion</span>
                      </h4>
                      <p className="text-gray-300 text-sm">{feedback.suggestion}</p>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Improvement Plan Tab */}
          <TabsContent value="improvement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Short Term */}
              <div className="card-neon">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Zap className="h-5 w-5 text-amber-400" />
                    <span>Short Term (1-2 weeks)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(safeAnalysisData.improvementPlan?.shortTerm || []).map((item: any, index: number) => 
                      renderImprovementItem(item, index)
                    )}
                  </div>
                </CardContent>
              </div>

              {/* Medium Term */}
              <div className="card-neon">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Target className="h-5 w-5 text-cyan-400" />
                    <span>Medium Term (1-3 months)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(safeAnalysisData.improvementPlan?.mediumTerm || []).map((item: any, index: number) => 
                      renderImprovementItem(item, index)
                    )}
                  </div>
                </CardContent>
              </div>

              {/* Long Term */}
              <div className="card-neon">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Award className="h-5 w-5 text-emerald-400" />
                    <span>Long Term (3+ months)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(safeAnalysisData.improvementPlan?.longTerm || []).map((item: any, index: number) => 
                      renderImprovementItem(item, index)
                    )}
                  </div>
                </CardContent>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card-neon">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <ChevronRight className="h-5 w-5 text-cyan-400" />
                  <span>Immediate Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(safeAnalysisData.nextSteps || []).map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div className="w-6 h-6 bg-fuchsia-500/20 border border-fuchsia-400/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-fuchsia-400">{index + 1}</span>
                      </div>
                      <span className="text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          {onRetakeDebate && (
            <Button 
              onClick={onRetakeDebate}
              className="btn-neon-secondary text-lg px-8 py-3 flex items-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Practice Again</span>
            </Button>
          )}
          <Button 
            onClick={onContinue || onClose}
            className="btn-neon-primary text-lg px-8 py-3"
          >
            Continue Learning
          </Button>
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 p-6 bg-gradient-to-r from-cyan-950/30 to-fuchsia-950/30 rounded-xl border border-cyan-400/30">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
              <Star className="h-6 w-6 text-amber-400" />
              <span>Keep Growing!</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {safeAnalysisData.motivationalInsights?.encouragement || "Every debate is a learning opportunity. Keep practicing and you'll continue to improve!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateAnalysis;