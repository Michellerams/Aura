import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

// A simple component to find and render Markdown links as clickable <a> tags.
const LinkifiedText: React.FC<{ text: string }> = ({ text }) => {
  // Regex to find Markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = text.split(linkRegex);

  return (
    <>
      {parts.map((part, i) => {
        // In the 'parts' array, the structure is [text, linkText, url, text, linkText, url, ...].
        // The link text is at index 1, 4, 7, ...
        if (i % 3 === 1) {
          // The URL is the next element in the array.
          const url = parts[i + 1];
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              {part}
            </a>
          );
        }
        // The URL part is at index 2, 5, 8, ... We skip rendering it directly.
        if (i % 3 === 2) {
          return null;
        }
        // This is a plain text part.
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start py-6 ${!isModel && 'flex-row-reverse'} ${isModel ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}>
      <div
        className={`w-full max-w-2xl px-5 py-4 rounded-2xl ${
          isModel
            ? 'bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-bl-none'
            : 'bg-blue-600/70 backdrop-blur-sm text-white rounded-br-none'
        }`}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {isModel ? <LinkifiedText text={message.text} /> : message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;