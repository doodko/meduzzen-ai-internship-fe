import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ChatMessage } from "@/types/message";
import { Persona } from "@/types/persona";
import { JSX } from "react";

export default function AgentMessage({
  message,
  persona,
}: {
  message: ChatMessage;
  persona: Persona;
}): JSX.Element {
  return (
    <div className="flex justify-start items-start gap-2">
      <div className="w-8 h-8 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
        {persona.icon}
      </div>
      <div className="bg-[#444654] rounded-lg px-4 py-2 max-w-full whitespace-pre-wrap overflow-x-auto text-sm">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
