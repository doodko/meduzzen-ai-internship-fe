import { Persona } from "@/types/persona";

interface HeaderBarProps {
  persona: Persona;
  onReset: () => void;
}

export default function HeaderBar({ persona, onReset }: HeaderBarProps) {
  return (
    <div
      className="text-center text-sm text-gray-400 py-2 border-b border-[#2c2d36] cursor-pointer hover:underline"
      onClick={onReset}
    >
      {`You’re chatting with ${persona.icon} ${persona.title}`}
    </div>
  );
}
