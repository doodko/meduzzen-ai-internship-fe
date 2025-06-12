import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/message';
import UserMessage from '@/components/UserMessage';
import AgentMessage from '@/components/AgentMessage';
import { Persona } from '@/types/persona';

interface ChatSectionProps {
  messages: ChatMessage[];
  loading: boolean;
  persona: Persona;
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages, loading, persona }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto px-4 sm:px-8 md:px-40 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-center text-xl">{persona.welcomeMessage}</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              if (msg.type === 'user') return <UserMessage key={idx} message={msg} />;
              return <AgentMessage key={idx} message={msg} persona={persona} />;
            })}
            {loading && !messages.some((m) => m.type === 'agent') && (
              <div className="flex justify-start items-start gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {persona.icon}
                </div>
                <div className="bg-[#444654] rounded-lg px-4 py-2 max-w-xs sm:max-w-md animate-pulse">
                  <p>typing...</p>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ChatSection;
