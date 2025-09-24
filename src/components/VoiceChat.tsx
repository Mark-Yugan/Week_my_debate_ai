
// @ts-nocheck
import React, { useState } from 'react';
import { getDeepSeekResponse } from '../api/deepseek';

const VoiceChat = () => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);

    recognition.onresult = async (event: any) => {
      const userInput = event.results[0][0].transcript;
      setTranscript(userInput);
      const reply = await getDeepSeekResponse(userInput);
      setResponse(reply);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <button
        onClick={startRecording}
        className={`bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition ${
          isRecording ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isRecording}
      >
        {isRecording ? 'Listening...' : '🎤 Start Speaking'}
      </button>

      <div>
        <h3 className="text-lg font-semibold">You:</h3>
        <p className="bg-gray-100 p-3 rounded-md">{transcript}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Chanakya AI:</h3>
        <p className="bg-yellow-100 p-3 rounded-md">{response}</p>
      </div>
    </div>
  );
};

export default VoiceChat;
