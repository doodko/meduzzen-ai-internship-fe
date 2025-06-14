import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/message";
import { Persona } from "@/types/persona";
import { motion } from "framer-motion";
import ChatMessageBubble from "@/components/ChatMessageBubble";
import Avatar from "@/components/Avatar";

interface ChatSectionProps {
  messages: ChatMessage[];
  loading: boolean;
  persona: Persona;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  loading,
  persona,
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center text-xl text-gray-400 px-4"
          >
            {persona.welcomeMessage}
          </motion.p>
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
  );
};

export default ChatSection;
