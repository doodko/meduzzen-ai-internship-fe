"use client";

import React, { useCallback, useRef, useState } from "react";
import { ChatMessage } from "@/types/message";
import ChatSection from "@/components/ChatSection";

import { useChatSocket } from "@/hooks/useChatSocket";
import { Persona } from "@/types/persona";
import PersonaSelector from "@/pages/PersonaSelectorPage";
import HeaderBar from "@/components/HeaderBar";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [personaPrompt, setPersonaPrompt] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);

  const socketRef = useChatSocket(setMessages, setLoading, personaPrompt);
  const assistantMessageRef = useRef("");

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !userInput.trim() ||
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        return;
      }

      const userMessage: ChatMessage = { type: "user", text: userInput.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      assistantMessageRef.current = "";
      socketRef.current.send(userInput.trim());
      setUserInput("");
    },
    [userInput, socketRef],
  );

  const resetChat = () => {
    setMessages([]);
    setPersonaPrompt(null);
    setPersona(null);
  };

  if (!personaPrompt || !persona) {
    return (
      <PersonaSelector
        action={(selectedPersona) => {
          setPersonaPrompt(selectedPersona.prompt);
          setPersona(selectedPersona);
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HeaderBar persona={persona} onReset={resetChat} />
      <ChatSection messages={messages} loading={loading} persona={persona} />
      <ChatInput
        input={userInput}
        setInput={setUserInput}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}
