import { ChatMessage } from "@/types/message";
import { Persona } from "@/types/persona";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

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
      <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
        {isUser ? "U" : persona.icon}
      </div>

      <div
        className={`
          ${isUser ? "bg-blue-600" : "bg-gray-700 "}
          rounded-lg text-gray-300 px-4 py-2 max-w-full whitespace-pre-wrap overflow-x-auto sm:max-w-md
        `}
      >
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
