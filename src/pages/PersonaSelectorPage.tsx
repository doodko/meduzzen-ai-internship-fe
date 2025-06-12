'use client';

import React, {useState} from 'react';
import {Persona} from '@/types/persona';
import {personas} from "@/constants/persona";

export default function PersonaSelector({
  action,
}: {
  action: (persona: Persona) => void;
}) {
  const [selected, setSelected] = useState<Persona | null>(null);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#202123] text-white px-4">
      <h1 className="text-2xl font-semibold mb-8">Choose Your Assistant</h1>

      <div className="grid gap-4 w-full max-w-sm">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setSelected(persona)}
            className={`cursor-pointer flex items-center gap-4 px-6 py-4 rounded-xl border transition duration-300 text-left ${
              selected?.id === persona.id
                ? 'bg-[#3f404e] border-blue-700'
                : 'bg-[#343541] border-[#2c2d36] hover:bg-[#3f404e]'
            }`}
          >
            <div className="text-2xl">{persona.icon}</div>
            <div>
              <div className="text-lg font-medium">{persona.title}</div>
              {selected?.id === persona.id && (
                <p className="text-sm text-gray-400 mt-1">{persona.prompt}</p>
              )}
            </div>
          </button>
        ))}
        {selected && (
          <button
            className="cursor-pointer mt-8 px-6 py-3 rounded-lg bg-blue-800 hover:bg-blue-900 font-semibold"
            onClick={() => action(selected)}
          >
            Start Chatting
          </button>
        )}
      </div>
    </div>
  );
}
