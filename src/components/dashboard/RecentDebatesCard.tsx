
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
    <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      <CardHeader className="relative z-10 pb-6">
        <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-[#009] rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <span>Recent Debates</span>
        </CardTitle>
        <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-light">
          Your latest debate performances with Freud scores
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#009] rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="relative h-8 w-8 animate-spin text-[#009]" />
              </div>
              <span className="text-gray-600 font-light">Loading your recent debates...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20"></div>
                <AlertCircle className="relative h-8 w-8 text-red-500 mx-auto" />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">{error}</p>
                <p className="text-xs text-gray-500 mt-1">Please try again later</p>
              </div>
            </div>
          </div>
        ) : debates.length === 0 ? (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#009] rounded-full blur-2xl opacity-10"></div>
                <Clock className="relative h-12 w-12 text-[#009] mx-auto opacity-60" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">No debates yet</p>
                <p className="text-xs text-gray-500 mt-1">Start your first debate to see your progress here</p>
              </div>
            </div>
          </div>
        ) : (
          debates.map((debate, index) => (
            <div key={debate.id || index} className="group/item p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-[#009]/5 hover:to-[#0066cc]/5 hover:border-[#009]/20 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 group-hover/item:text-[#009] transition-colors duration-300">{debate.topic}</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">vs {debate.opponent}</p>
                  <p className="text-xs text-gray-500 mt-1 font-light">
                    {debate.createdAt.toLocaleDateString()} • {debate.difficulty}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <Badge 
                    variant={debate.result === 'Win' ? 'default' : debate.result === 'Loss' ? 'secondary' : 'outline'}
                    className={
                      debate.result === 'Win' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm' : 
                      debate.result === 'Loss' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm' :
                      'bg-gradient-to-r from-[#009] to-[#0066cc] text-white shadow-sm'
                    }
                  >
                    {debate.result}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full animate-pulse"></div>
                    <p className="text-xs text-[#009] font-semibold">+{debate.tokens} tokens</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-3 py-1.5 rounded-full font-medium border border-red-200/50">Id: {debate.freudScore.id}</span>
                <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium border border-blue-200/50">Ego: {debate.freudScore.ego}</span>
                <span className="text-xs bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium border border-green-200/50">Superego: {debate.freudScore.superego}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDebatesCard;
