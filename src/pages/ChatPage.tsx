"use client";

import React, { useCallback, useRef, useState } from "react";
import { ChatMessage, ChatSessionMeta } from "@/types/message";
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
  const [sessionId, setSessionId] = useState<string | null>(null);

  const socketRef = useChatSocket(setMessages, setLoading, sessionId);
  const assistantMessageRef = useRef("");

  async function createChatSession(
    system_message: string,
  ): Promise<ChatSessionMeta> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_message }),
    });

    if (!res.ok) throw new Error("Failed to create chat session");
    return res.json();
  }

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
    setSessionId(null);
  };

  if (!personaPrompt || !persona || !sessionId) {
    return (
      <PersonaSelector
        action={async (selectedPersona) => {
          try {
            const session = await createChatSession(selectedPersona.prompt);
            setPersonaPrompt(session.system_message);
            setPersona(selectedPersona);
            setSessionId(session.session_id);
          } catch (err) {
            console.error("Session creation failed:", err);
          }
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
