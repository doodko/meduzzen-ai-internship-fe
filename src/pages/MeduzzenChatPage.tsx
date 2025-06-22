"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/types/message";
import { motion } from "framer-motion";
import ChatMessageBubble from "@/components/ChatMessageBubble";
import Avatar from "@/components/Avatar";
import { Persona } from "@/types/persona";
import { createChatSession } from "@/app/api/chat/calls";
import { useChatSocket } from "@/hooks/useChatSocket";

const MeduzzenAssistantPage = () => {
  const endRef = useRef<HTMLDivElement>(null);

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const socketRef = useChatSocket(setMessages, setLoading, sessionId, "/rag");

  const persona: Persona = {
    id: "meduzzen",
    title: "onboarding-assistant",
    prompt: "",
    icon: "👨🏼‍💻",
    welcomeMessage:
      "hey! I'm ur Medduzen onboarding assistant. feel free to ask me everything about the company",
  };

  const handleSendMessage = useCallback(() => {
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
  }, [userInput, socketRef]);

  const startChat = async () => {
    if (!userInput.trim()) return;
    try {
      const session = await createChatSession("");
      setSessionId(session.session_id);
      handleSendMessage();
      setLoading(true);
    } catch (error) {
      console.error("Chat start failed:", error);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center text-xl text-gray-300 max-w-md"
            >
              {persona.welcomeMessage}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startChat()}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={startChat}
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl w-full mx-auto px-4 space-y-4">
            {messages.map((msg, idx) => {
              const isUser = msg.type === "user";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isUser ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <ChatMessageBubble message={msg} persona={persona} />
                </motion.div>
              );
            })}

            {loading && !messages.some((m) => m.type === "agent") && (
              <div className="flex justify-start items-start gap-2">
                <Avatar name={persona.icon} />
                <div className="bg-[#444654] rounded-lg px-4 py-2 max-w-xs sm:max-w-md animate-pulse">
                  <p>typing...</p>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeduzzenAssistantPage;
