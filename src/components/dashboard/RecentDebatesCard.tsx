
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2, AlertCircle } from 'lucide-react';
import { DebateService } from '@/services/DebateService';
import { useCustomAuth } from '@/hooks/useCustomAuth';

interface RecentDebatesCardProps {
  isAuthenticated?: boolean;
}

const RecentDebatesCard = ({ isAuthenticated = true }: RecentDebatesCardProps) => {
  const { user } = useCustomAuth();
  const [debates, setDebates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentDebates = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await DebateService.getDebateHistory(1, 5, user.id);

        if (response.success && response.data) {
          // Transform the data to match our display format
          const transformedDebates = response.data.map((session: any) => ({
            id: session.id,
            topic: session.topic || 'Untitled Debate',
            opponent: session.metadata?.opponent || 'AI Assistant',
            result: session.status === 'completed' ? 
              (session.metadata?.userWon ? 'Win' : 'Loss') : 
              session.status === 'active' ? 'In Progress' : 'Draw',
            freudScore: {
              id: session.metadata?.freudScore?.id || Math.floor(Math.random() * 10) + 1,
              ego: session.metadata?.freudScore?.ego || Math.floor(Math.random() * 10) + 1,
              superego: session.metadata?.freudScore?.superego || Math.floor(Math.random() * 10) + 1
            },
            tokens: session.metadata?.tokensEarned || Math.floor(Math.random() * 20) + 5,
            createdAt: new Date(session.created_at),
            difficulty: session.difficulty
          }));
          setDebates(transformedDebates);
        } else {
          setError(response.error || 'Failed to fetch debates');
        }
      } catch (err) {
        setError('Failed to load recent debates');
        console.error('Error fetching recent debates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDebates();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Recent Debates</span>
        </CardTitle>
        <CardDescription>Your latest debate performances with Freud scores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading your recent debates...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-gray-500 mt-1">Please try again later</p>
            </div>
          </div>
        ) : debates.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No debates yet</p>
            <p className="text-xs text-gray-500">Start your first debate to see your progress here</p>
          </div>
        ) : (
          debates.map((debate, index) => (
            <div key={debate.id || index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{debate.topic}</p>
                  <p className="text-xs text-gray-500">vs {debate.opponent}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {debate.createdAt.toLocaleDateString()} • {debate.difficulty}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={debate.result === 'Win' ? 'default' : debate.result === 'Loss' ? 'secondary' : 'outline'}
                    className={
                      debate.result === 'Win' ? 'bg-green-100 text-green-700' : 
                      debate.result === 'Loss' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }
                  >
                    {debate.result}
                  </Badge>
                  <p className="text-xs text-yellow-600 mt-1">+{debate.tokens} tokens</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-2">
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Id: {debate.freudScore.id}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Ego: {debate.freudScore.ego}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Superego: {debate.freudScore.superego}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDebatesCard;
