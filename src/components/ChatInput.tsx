import React from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({
  input,
  setInput,
  onSubmit,
}: ChatInputProps) {
  return (
    <div className="px-4 py-3 bg-[#40414f] border-t border-[#2c2d36]">
      <form className="flex items-center space-x-2" onSubmit={onSubmit}>
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
  );
}
