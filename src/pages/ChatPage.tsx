'use client';

import React, { useCallback, useRef, useState } from 'react';
import { ChatMessage } from '@/types/message';
import ChatSection from '@/components/ChatSection';

import { useChatSocket } from '@/hooks/useChatSocket';
import PersonaSelector from '@/pages/PersonaSelector';
import { personas } from '@/constants/persona';
import { Persona } from '@/types/persona';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);

  const socketRef = useChatSocket(setMessages, setLoading, systemMessage);
  const assistantMessageRef = useRef('');

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
        return;

      const userMessage: ChatMessage = { type: 'user', text: input.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      assistantMessageRef.current = '';
      socketRef.current.send(input.trim());
      setInput('');
    },
    [input, socketRef]
  );

  if (!systemMessage || !persona) {
    return (
      <PersonaSelector
        onConfirm={(selectedPersona) => {
          setSystemMessage(selectedPersona.prompt);
          setPersona(selectedPersona);
        }}
        personas={personas}
      />
    );
  }

  return (
    <div className="h-screen bg-[#202123] text-white flex flex-col overflow-hidden">
      <div className="text-center text-sm text-gray-400 py-2 border-b border-[#2c2d36]">
        {`You’re chatting with ${persona.icon} ${persona.title}`}
      </div>

      <ChatSection messages={messages} loading={loading} persona={persona} />

      <div className="px-4 py-3 bg-[#40414f] border-t border-[#2c2d36]">
        <form className="flex items-center space-x-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-[#202123] text-white px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
