import { ChatMessage } from "@/types/message";
import { Persona } from "@/types/persona";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Avatar from "@/components/Avatar";

export default function ChatMessageBubble({
  message,
  persona,
}: {
  message: ChatMessage;
  persona: Persona;
}) {
  const isUser = message.type === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar name={isUser ? "U" : persona.icon} />

      <div
        className={`
          ${isUser ? "bg-blue-600" : "bg-gray-700"}
          text-gray-300 rounded-lg px-4 py-2 whitespace-pre-wrap overflow-x-auto
          max-w-[calc(100%-3.5rem)] sm:max-w-[calc(100%-5.5rem)] lg:max-w-prose
        `}
      >
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
