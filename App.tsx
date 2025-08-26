
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants';
import { createChatSession } from './services/geminiService';
import type { Message } from './types';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

const Starfield: React.FC = () => {
    const stars = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 50 + 50}s`,
            animationDelay: `${Math.random() * 100}s`,
            size: `${Math.random() * 2 + 1}px`
        }));
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full -z-20">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="absolute bg-white/50 rounded-full animate-stars"
                    style={{
                        top: '2000px', // Start below the screen
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        animationName: 'animate-stars',
                        animationDuration: star.animationDuration,
                        animationDelay: star.animationDelay,
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite'
                    }}
                />
            ))}
        </div>
    );
};


const Background: React.FC = () => (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <Starfield />
        <div 
            className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/50 rounded-full filter blur-3xl opacity-30"
            style={{ animation: 'animate-aurora 20s infinite alternate' }}
        ></div>
        <div 
            className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-cyan-900/50 rounded-full filter blur-3xl opacity-30"
            style={{ animation: 'animate-aurora 25s infinite alternate-reverse' }}
        ></div>
    </div>
)

function App() {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const session = createChatSession(SYSTEM_INSTRUCTION);
      setChat(session);
    } catch(error) {
      console.error("Failed to initialize chat session:", error);
      // Handle error gracefully, e.g. show an error message to the user
      alert("Error: Could not start the AI assistant. Please check your API key and refresh the page.");
    }
  }, []);

  const handleSendMessage = useCallback(async (input: string) => {
    if (!chat || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    const modelMessageId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, userMessage, { id: modelMessageId, role: 'model', text: '' }]);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId
              ? { ...msg, text: msg.text + chunkText }
              : msg
          )
        );
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMessageId
            ? { ...msg, text: "Sorry, I encountered an error. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);


  return (
    <div className="relative text-white min-h-screen flex flex-col font-sans">
        <Background />
        <header className="px-4 md:px-8 py-3 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 text-center">
            <h1 className="text-xl font-semibold tracking-wider text-gray-200">AI KNOWLEDGE ASSISTANT</h1>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow messages={messages} isLoading={isLoading} onPromptClick={handleSendMessage} />
            <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </main>
    </div>
  );
}

export default App;