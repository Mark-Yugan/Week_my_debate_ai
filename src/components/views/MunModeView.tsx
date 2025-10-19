
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Users, Gavel, Trophy, Shield, Crown, Star } from 'lucide-react';

interface MunModeViewProps {
  handlers: {
    handleProcedureSelect: (procedureType: 'UNA-USA' | 'Indian Parliamentary') => void;
    handleBackToDashboard: () => void;
  };
}

const MunModeView = ({ handlers }: MunModeViewProps) => {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-gray-950 to-fuchsia-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handlers.handleBackToDashboard}
              className="btn-neon-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            <div className="text-right">
              <h1 className="text-4xl font-bold font-orbitron neon-text">
                MUN Mode
              </h1>
              <p className="text-gray-300 mt-1 font-inter">Experience Model United Nations</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full blur-xl opacity-25 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-fuchsia-500 p-4 rounded-full shadow-neon">
                <Globe className="h-12 w-12 text-gray-950" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4 font-orbitron">
            Welcome to{' '}
            <span className="neon-text">
              Diplomatic Arena
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience Model United Nations with Gavel Bro, your AI-powered moderator and parliamentary procedure expert
          </p>
        </div>

        {/* Gavel Bro Introduction */}
        <div className="card-neon mb-8">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="mx-auto bg-gradient-to-r from-cyan-400 to-fuchsia-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-neon">
                <Gavel className="h-10 w-10 text-gray-950" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">Meet Gavel Bro</h3>
              <p className="text-gray-300">Your AI-powered MUN moderator and parliamentary procedure expert</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-colors">
                <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Global Committees
                </h4>
                <p className="text-sm text-gray-400">Join UN Security Council, General Assembly, and specialized agencies</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-fuchsia-400/30 hover:border-fuchsia-400/50 transition-colors">
                <h4 className="font-semibold text-fuchsia-300 mb-2 flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Indian Parliament
                </h4>
                <p className="text-sm text-gray-400">Experience Lok Sabha and Rajya Sabha sessions with current issues</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-colors">
                <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Real-time Moderation
                </h4>
                <p className="text-sm text-gray-400">Gavel Bro ensures proper parliamentary procedures and fair debates</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-fuchsia-400/30 hover:border-fuchsia-400/50 transition-colors">
                <h4 className="font-semibold text-fuchsia-300 mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Token Rewards
                </h4>
                <p className="text-sm text-gray-400">Earn 25-50 tokens based on your diplomatic performance</p>
              </div>
            </div>

            <div className="text-center">
              <button 
                className="btn-neon-primary px-8 py-4 text-lg font-bold flex items-center justify-center gap-2"
                onClick={() => handlers.handleProcedureSelect('UNA-USA')}
              >
                <Users className="h-5 w-5" />
                Enter MUN Chambers
                <Star className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunModeView;
