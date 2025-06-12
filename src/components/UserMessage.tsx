import { ChatMessage } from "@/types/message";

export default function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end items-start gap-3">
      <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-xs sm:max-w-md">
        <p>{message.text}</p>
      </div>
      <div className="w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
        U
      </div>
    </div>
  );
}
