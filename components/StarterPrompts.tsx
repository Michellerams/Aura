import React from 'react';
import { STARTER_PROMPTS } from '../constants';

interface StarterPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const StarterPrompts: React.FC<StarterPromptsProps> = ({ onPromptClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white pt-20">
      <h1 className="text-4xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>AI Knowledge Assistant</h1>
      <p className="mt-3 text-lg text-gray-400 max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
        I'm Aura, your guide to AI fundamentals. What would you like to explore first?
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {STARTER_PROMPTS.map((item, index) => (
          <button
            key={item.title}
            onClick={() => onPromptClick(item.prompt)}
            className="p-5 bg-gray-800/50 border border-gray-700 rounded-lg text-left hover:bg-gray-700/70 transition-colors duration-200 animate-fade-in"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <p className="font-semibold text-gray-200">{item.title}</p>
            <p className="text-sm text-gray-400 mt-1">{item.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarterPrompts;