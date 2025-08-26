
import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';
import StarterPrompts from './StarterPrompts';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onPromptClick: (prompt: string) => void;
}

const ThinkingIndicator: React.FC = () => (
    <div className="flex items-start py-6 animate-slide-in-left">
        <div className="w-full max-w-2xl px-5 py-4 rounded-2xl bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-bl-none">
            <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>
    </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onPromptClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
            {messages.length === 0 && !isLoading && (
                <StarterPrompts onPromptClick={onPromptClick} />
            )}
            {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
        </div>
    </div>
  );
};

export default ChatWindow;