import { Button } from '@/components/ui/button';
import { Mic, MicOff, Radio, Brain, Volume2, VolumeX } from 'lucide-react';

interface FloatingMicrophoneProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  isDeepSeekProcessing?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isSpeaking?: boolean;
}

const FloatingMicrophone = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  disabled = false,
  isDeepSeekProcessing = false,
  isMuted = false,
  onToggleMute,
  isSpeaking = false,
}: FloatingMicrophoneProps) => {
  const handleClick = () => {
    if (disabled || isDeepSeekProcessing) return;
    isRecording ? onStopRecording() : onStartRecording();
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999]">
      <div className="relative flex flex-col items-center space-y-3">
        {/* DeepSeek Processing Indicator */}
        {isDeepSeekProcessing && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-cyan-500/90 text-black text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm animate-pulse shadow-neon">
            <div className="flex items-center space-x-2">
              <Brain className="h-3 w-3 animate-spin" />
              <span className="font-bold">Chanakya AI thinking...</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-cyan-500"></div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          disabled={disabled || isDeepSeekProcessing}
          onClick={handleClick}
          className={`w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center ${
            isRecording
              ? 'bg-gradient-to-br from-fuchsia-500 to-red-500 hover:from-fuchsia-600 hover:to-red-600 animate-pulse scale-110 shadow-neon border border-fuchsia-400'
              : disabled || isDeepSeekProcessing
              ? 'bg-gray-700 cursor-not-allowed border border-gray-600'
              : 'btn-neon-primary hover:scale-105'
          }`}
        >
          {isRecording ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Mute Button for TTS */}
        {onToggleMute && (
          <button
            onClick={onToggleMute}
            disabled={disabled}
            className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-neon border border-red-400'
                : isSpeaking
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-neon border border-orange-400'
                : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-600'
            }`}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : isSpeaking ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Recording Animation Ring */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-fuchsia-400 animate-ping opacity-75 pointer-events-none"></div>
        )}

        {/* DeepSeek Processing Ring */}
        {isDeepSeekProcessing && (
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-spin opacity-75 pointer-events-none"></div>
        )}

        {/* Speaking Animation Ring */}
        {isSpeaking && !isMuted && (
          <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-75 pointer-events-none"></div>
        )}

        {/* Status Tooltip */}
        {isRecording && !isDeepSeekProcessing && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-950/95 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm border border-cyan-400/50 shadow-neon">
            <div className="flex items-center space-x-2">
              <Radio className="h-3 w-3 text-fuchsia-400 animate-pulse" />
              <span className="font-medium">Listening... Speak clearly!</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-950"></div>
          </div>
        )}

        {/* Speaking Tooltip */}
        {isSpeaking && !isMuted && !isRecording && !isDeepSeekProcessing && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-950/95 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm border border-cyan-400/50 shadow-neon">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-3 w-3 text-orange-400 animate-pulse" />
              <span className="font-medium">Chanakya AI speaking...</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-950"></div>
          </div>
        )}

        {/* Muted Tooltip */}
        {isMuted && !isRecording && !isDeepSeekProcessing && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-950/95 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm border border-cyan-400/50 shadow-neon">
            <div className="flex items-center space-x-2">
              <VolumeX className="h-3 w-3 text-red-400" />
              <span className="font-medium">AI Voice Muted</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-950"></div>
          </div>
        )}

        {/* Disabled State Tooltip */}
        {disabled && !isRecording && !isDeepSeekProcessing && !isSpeaking && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-950/95 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm border border-gray-600/50">
            <span>Wait for your turn</span>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-950"></div>
          </div>
        )}

        {/* Pulsing Glow Effect for Active State */}
        {!disabled && !isRecording && !isDeepSeekProcessing && !isSpeaking && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400 opacity-20 animate-pulse pointer-events-none"></div>
        )}

        {/* Status Indicator */}
        {!disabled && !isRecording && !isDeepSeekProcessing && !isSpeaking && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 text-center">
            <div className="flex items-center space-x-1 bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-1 border border-cyan-400/30">
              <Brain className="h-3 w-3 text-cyan-400" />
              <span className="text-cyan-400">Ready</span>
              {isMuted && (
                <span className="text-red-400 ml-1">• Muted</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingMicrophone;
