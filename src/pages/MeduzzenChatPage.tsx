"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/types/message";
import { createChatSession } from "@/app/api/chat/calls";
import ChatInput from "@/components/ChatInput";
import ChatSection from "@/components/ChatSection";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
  const [interrupted, setInterrupted] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const streamingStoppedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/rag/${sessionId}`,
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "token") {
        if (streamingStoppedRef.current || interrupted) return;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.type === "agent") {
            return [
              ...prev.slice(0, -1),
              { ...last, text: last.text + data.content },
            ];
          } else {
            return [...prev, { type: "agent", text: data.content }];
          }
        });
        return;
      }

      if (data.type === "tool_start") {
        const log = `[calling tool ${data.tool} with args: ${JSON.stringify(data.args)}]`;
        setMessages((prev) => [...prev, { type: "system", text: log }]);
        return;
      }

      if (data.type === "completion") {
        if (!streamingStoppedRef.current) {
          setLoading(false);
          setInterrupted(false);
        }
        return;
      }

      if (data.type === "error") {
        setMessages((prev) => [
          ...prev,
          { type: "system", text: data.content },
        ]);
        setLoading(false);
        return;
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      toast.error("WebSocket connection error");
      setLoading(false);
    };

    return () => socket.close();
  }, [sessionId]);

  const initializeSession = async () => {
    try {
      const session = await createChatSession(staticPersona.prompt);
      setSessionId(session.session_id);
      return session.session_id;
    } catch (err) {
      console.error("Failed to create session:", err);
      toast.error("Failed to create session");
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
      setInterrupted(false);
      streamingStoppedRef.current = false;
      socketRef.current.send(userInput.trim());
      setUserInput("");
    },
    [userInput],
  );

  const handleStop = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    streamingStoppedRef.current = true;
    setInterrupted(true);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      { type: "system", text: "[interrupted by user]" },
    ]);
  };

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
        disableUpload={loading}
        loading={loading}
        onStop={handleStop}
        setMessages={setMessages}
      />
    </div>
  );
}
