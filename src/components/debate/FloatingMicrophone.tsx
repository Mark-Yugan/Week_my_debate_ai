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
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm animate-pulse">
            <div className="flex items-center space-x-2">
              <Brain className="h-3 w-3 animate-spin" />
              <span className="font-medium">Chanakya AI thinking...</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-emerald-600"></div>
          </div>
        )}

        {/* Floating Action Button */}
        <Button
          size="lg"
          disabled={disabled || isDeepSeekProcessing}
          onClick={handleClick}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse scale-110 shadow-red-500/50'
              : disabled || isDeepSeekProcessing
              ? 'bg-gray-400 cursor-not-allowed shadow-gray-400/30'
              : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 hover:scale-105 shadow-indigo-500/30'
          }`}
        >
          {isRecording ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>

        {/* Mute Button for TTS */}
        {onToggleMute && (
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "outline"}
            onClick={onToggleMute}
            disabled={disabled}
            className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                : isSpeaking
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-gray-400/30'
            }`}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Recording Animation Ring */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75 pointer-events-none"></div>
        )}

        {/* DeepSeek Processing Ring */}
        {isDeepSeekProcessing && (
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-spin opacity-75 pointer-events-none"></div>
        )}

        {/* Speaking Animation Ring */}
        {isSpeaking && !isMuted && (
          <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-75 pointer-events-none"></div>
        )}

        {/* Status Tooltip */}
        {isRecording && !isDeepSeekProcessing && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Radio className="h-3 w-3 text-red-400 animate-pulse" />
              <span className="font-medium">Listening... Speak clearly!</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
          </div>
        )}

        {/* Speaking Tooltip */}
        {isSpeaking && !isMuted && !isRecording && !isDeepSeekProcessing && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-3 w-3 text-orange-400 animate-pulse" />
              <span className="font-medium">Chanakya AI speaking...</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
          </div>
        )}

        {/* Muted Tooltip */}
        {isMuted && !isRecording && !isDeepSeekProcessing && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <VolumeX className="h-3 w-3 text-red-400" />
              <span className="font-medium">AI Voice Muted</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
          </div>
        )}

        {/* Disabled State Tooltip */}
        {disabled && !isRecording && !isDeepSeekProcessing && !isSpeaking && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
            <span>Wait for your turn</span>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
          </div>
        )}

        {/* Pulsing Glow Effect for Active State */}
        {!disabled && !isRecording && !isDeepSeekProcessing && !isSpeaking && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 opacity-20 animate-pulse pointer-events-none"></div>
        )}

        {/* Status Indicator */}
        {!disabled && !isRecording && !isDeepSeekProcessing && !isSpeaking && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 text-center">
            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
              <Brain className="h-3 w-3 text-emerald-600" />
              <span></span>
              {isMuted && (
                <span className="text-red-500 ml-1">• Muted</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingMicrophone;
