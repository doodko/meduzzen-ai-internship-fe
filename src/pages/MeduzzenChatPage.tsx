"use client";

import React, { useCallback, useState } from "react";
import { ChatMessage } from "@/types/message";
import { useChatSocket } from "@/hooks/useChatSocket";
import { createChatSession } from "@/app/api/chat/calls";
import ChatInput from "@/components/ChatInput";
import ChatSection from "@/components/ChatSection";
import { motion } from "framer-motion";

const staticPersona = {
  id: "meduzzen",
  title: "onboarding-assistant",
  prompt: "",
  icon: "👨🏼‍💻",
  welcomeMessage:
    "hey! I'm ur Medduzen onboarding assistant. Feel free to ask me anything about the company.",
};

export default function MeduzzenAssistantPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const socketRef = useChatSocket(setMessages, setLoading, sessionId, "/rag");

  const initializeSession = async () => {
    try {
      const session = await createChatSession(staticPersona.prompt);
      setSessionId(session.session_id);
      return session.session_id;
    } catch (err) {
      console.error("Failed to create session:", err);
      return null;
    }
  };

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
      socketRef.current.send(userInput.trim());
      setUserInput("");
    },
    [userInput, socketRef],
  );

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 space-y-6 text-center">
        <div className="text-xl font-medium text-gray-200 max-w-md">
          {staticPersona.welcomeMessage}
        </div>
        <motion.button
          onClick={initializeSession}
          type="submit"
          className="px-6 py-2 bg-gray-950 rounded-lg text-white  transition cursor-pointer"
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start chat
        </motion.button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ChatSection
        messages={messages}
        loading={loading}
        persona={staticPersona}
      />
      <ChatInput
        input={userInput}
        setInput={setUserInput}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}
