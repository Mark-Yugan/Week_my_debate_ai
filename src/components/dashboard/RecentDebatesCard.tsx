
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
    <div className="card-neon">
      <div className="p-6 border-b border-cyan-400/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 gradient-neon-primary rounded-xl blur-xl opacity-50"></div>
            <div className="relative gradient-neon-primary p-3 rounded-xl shadow-neon">
              <Clock className="h-6 w-6 text-gray-950" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-orbitron neon-text">Recent Debates</h3>
            <p className="text-gray-400 font-light text-sm">Your latest debate performances with Freud scores</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Loader2 className="relative h-8 w-8 animate-spin text-cyan-400" />
              </div>
              <span className="text-gray-300 font-light">Loading your recent debates...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50"></div>
                <AlertCircle className="relative h-8 w-8 text-red-400 mx-auto" />
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">{error}</p>
                <p className="text-xs text-gray-500 mt-1">Please try again later</p>
              </div>
            </div>
          </div>
        ) : debates.length === 0 ? (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-30"></div>
                <Clock className="relative h-12 w-12 text-cyan-400 mx-auto opacity-60" />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">No debates yet</p>
                <p className="text-xs text-gray-500 mt-1">Start your first debate to see your progress here</p>
              </div>
            </div>
          </div>
        ) : (
          debates.map((debate, index) => (
            <div key={debate.id || index} className="p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-neon">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">{debate.topic}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">vs {debate.opponent}</p>
                  <p className="text-xs text-gray-500 mt-1 font-light">
                    {debate.createdAt.toLocaleDateString()} • {debate.difficulty}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <div 
                    className={
                      debate.result === 'Win' ? 'badge-neon text-xs' : 
                      debate.result === 'Loss' ? 'px-2 py-1 bg-red-500/80 text-white text-xs rounded-md' :
                      'px-2 py-1 bg-fuchsia-500/80 text-white text-xs rounded-md'
                    }
                  >
                    {debate.result}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-cyan-400 font-semibold">+{debate.tokens} tokens</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full font-medium border border-red-400/30">Id: {debate.freudScore.id}</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full font-medium border border-cyan-400/30">Ego: {debate.freudScore.ego}</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full font-medium border border-green-400/30">Superego: {debate.freudScore.superego}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentDebatesCard;
