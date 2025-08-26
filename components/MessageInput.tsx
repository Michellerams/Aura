
import React, { useState, useEffect, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';

// FIX: Add types for Web Speech API to resolve TypeScript errors.
// The Web Speech API is not part of the standard DOM typings.
declare global {
  // Type for the SpeechRecognition object itself
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start(): void;
    stop(): void;
  }

  // Constructor for SpeechRecognition
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  // Event fired for results
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }

  // List of results
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    // FIX: Add readonly modifier to resolve TypeScript error about non-identical modifiers.
    readonly length: number;
  }

  // A single result
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    // FIX: Add readonly modifier to resolve TypeScript error about non-identical modifiers.
    readonly isFinal: boolean;
    // FIX: Add readonly modifier to resolve TypeScript error about non-identical modifiers.
    readonly length: number;
  }

  // A single alternative transcript
  interface SpeechRecognitionAlternative {
    // FIX: Add readonly modifier to resolve TypeScript error about non-identical modifiers.
    readonly transcript: string;
  }

  // Event fired for errors
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
  }

  // Extend the window object
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface MessageInputProps {
  onSendMessage: (input: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsMicSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setInput(''); 
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="px-4 md:px-8 py-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Ask about AI fundamentals..."}
              disabled={isLoading}
              className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-full pl-12 pr-6 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 transition-all duration-300"
            />
            {isMicSupported && (
                 <button
                 type="button"
                 onClick={handleMicClick}
                 disabled={isLoading}
                 className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
                     isRecording 
                         ? 'text-red-500 hover:bg-red-500/20' 
                         : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                 } disabled:opacity-50 disabled:cursor-not-allowed`}
                 aria-label={isRecording ? "Stop recording" : "Start recording"}
               >
                   {isRecording && <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></span>}
                   <MicrophoneIcon className="w-6 h-6 relative" />
               </button>
            )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;