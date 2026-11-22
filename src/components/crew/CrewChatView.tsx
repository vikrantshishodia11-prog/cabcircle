// src/components/crew/CrewChatView.tsx
'use client';

import React, { useState } from 'react';
import { CabMode, ChatMessage, Traveller, UserProfile } from '@/types/cabcircle';

interface CrewChatViewProps {
  currentUser: UserProfile;
  traveller: Traveller;
  cabMode: CabMode;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBackToCrew: () => void;
}

const QUICK_CHIPS = [
  'At Pillar 4',
  'Meet at Prepaid Booth',
  'Booking Cab Now',
  'Split via UPI',
];

export function CrewChatView({
  traveller,
  cabMode,
  messages,
  onSendMessage,
  onBackToCrew,
}: CrewChatViewProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#E2E6DC] overflow-hidden">
      <div className="p-3.5 bg-[#0F3D2E] text-white flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">{traveller.name} &amp; You</h3>
          <p className="text-[11px] text-[#C6F432]">Mode: {cabMode} · Split ₹{traveller.splitFare}</p>
        </div>
        <button
          type="button"
          onClick={onBackToCrew}
          className="text-[11px] bg-white/15 px-2.5 py-1 rounded-full"
        >
          Crew Info
        </button>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[280px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${
                msg.isMe
                  ? 'bg-[#0F3D2E] text-white rounded-br-sm'
                  : 'bg-[#F6F7F2] text-[#111915] rounded-bl-sm'
              }`}
            >
              <p>{msg.text}</p>
            </div>
            <span className="text-[10px] text-[#7D8780] mt-1">{msg.sender} · {msg.time}</span>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 bg-[#F6F7F2] flex gap-1.5 overflow-x-auto border-t border-[#E5E8DF]">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSendMessage(chip)}
            className="text-[11px] font-semibold bg-white border border-[#DCE0D5] text-[#0F3D2E] px-2.5 py-1 rounded-full whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#E5E8DF] flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Coordinate pickup spot..."
          className="flex-1 bg-[#F6F7F2] rounded-xl px-3.5 py-2.5 text-xs outline-none"
        />
        <button type="submit" className="bg-[#0F3D2E] text-white text-xs font-bold px-4 rounded-xl">
          Send
        </button>
      </form>
    </div>
  );
}