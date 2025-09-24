// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Crown,
  Search,
  Clock,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
}

interface OpponentSelectionProps {
  topic: Topic;
  onOpponentSelect: (type: 'ai' | '1v1' | 'mun') => void;
  onBack: () => void;
}

const OpponentSelection = ({ topic, onOpponentSelect, onBack }: OpponentSelectionProps) => {
  const [selectedOpponent, setSelectedOpponent] = useState<'ai' | '1v1' | 'mun' | null>(null);

  const availableStudents = [
    { name: 'Sarah M.', level: 'Advanced', winRate: '78%', status: 'online' },
    { name: 'Alex K.', level: 'Intermediate', winRate: '65%', status: 'online' },
    { name: 'Emma R.', level: 'Beginner', winRate: '52%', status: 'online' },
    { name: 'David L.', level: 'Advanced', winRate: '82%', status: 'away' },
  ];

  const aiOpponents = [
    { 
      name: 'Chanakya AI', 
      description: 'Fierce Indian debater with sharp arguments',
      difficulty: 'Hard',
      specialty: 'Indian Politics & Society'
    },
    { 
      name: 'Debate Master', 
      description: 'Adaptive AI that matches your skill level',
      difficulty: 'Adaptive',
      specialty: 'All Topics'
    },
    { 
      name: 'Newton AI', 
      description: 'Fact-based scientific reasoning',
      difficulty: 'Medium',
      specialty: 'Science & Technology'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Opponent</h1>
          <p className="text-gray-600">Topic: {topic.title}</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Topics
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Debate */}
        <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="gradient-indigo p-3 rounded-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Opponent</CardTitle>
                <CardDescription>Practice with intelligent AI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {aiOpponents.map((ai, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{ai.name}</h4>
                    <Badge variant="secondary" className="text-xs">{ai.difficulty}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{ai.description}</p>
                  <p className="text-xs text-blue-600">Specialty: {ai.specialty}</p>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Available 24/7</span>
                <Badge className="bg-green-100 text-green-700">Instant Start</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tokens</span>
                <span className="font-medium text-yellow-600">+5-15</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => onOpponentSelect('ai')}
            >
              <Bot className="h-4 w-4 mr-2" />
              Challenge Chanakya AI
            </Button>
          </CardContent>
        </Card>

        {/* Human Opponent */}
        <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="gradient-indigo p-3 rounded-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Human Opponent</CardTitle>
                <CardDescription>Debate with fellow students</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Students Online ({availableStudents.filter(s => s.status === 'online').length})</h4>
              {availableStudents.slice(0, 3).map((student, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${student.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm font-medium">{student.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{student.level}</p>
                    <p className="text-xs text-green-600">{student.winRate}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Matching</span>
                <Badge variant="secondary">By Skill Level</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tokens</span>
                <span className="font-medium text-yellow-600">+10-25</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => onOpponentSelect('1v1')}
            >
              <Search className="h-4 w-4 mr-2" />
              Find Opponent
            </Button>
          </CardContent>
        </Card>

        {/* MUN Arena - Remove from here since it's now separate */}
      </div>
    </div>
  );
};

export default OpponentSelection;
