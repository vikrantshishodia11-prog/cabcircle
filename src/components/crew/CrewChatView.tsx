// src/components/crew/CrewChatView.tsx
'use client';

import React, { useState } from 'react';
import { CabMode, ChatMessage, Traveller, UserProfile } from '@/types/cabcircle';

interface CrewChatViewProps {
  currentUser?: UserProfile;
  traveller: Traveller;
  cabMode?: CabMode;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBackToCrew: () => void;
}

const QUICK_CHIPS = [
  'At pickup point',
  '5 mins away',
  'Share ride together?',
  'Split via UPI',
];

export function CrewChatView({
  traveller,
  messages,
  onSendMessage,
  onBackToCrew,
}: CrewChatViewProps) {
  const [draft, setDraft] = useState('');
  const hubLabel = traveller.hubName || traveller.airport || 'Hub';
  const hubBadge = traveller.hubType === 'railway' ? 'Railway' : 'Airport';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#E6E9EF] shadow-sm overflow-hidden">
      <div className="p-3.5 bg-[#0D1F3C] text-white flex items-center justify-between gap-2 border-b border-[#C89D54]/30">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold truncate">{traveller.name} &amp; You</h3>
            <span className="text-[10px] font-bold bg-[#C89D54] text-[#0D1F3C] px-2 py-0.5 rounded-full shrink-0">
              {hubBadge}
            </span>
          </div>
          <p className="text-[11px] text-[#E5C285] truncate">
            {hubLabel} → {traveller.destination}
            {traveller.pickupPoint ? ` · ${traveller.pickupPoint}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToCrew}
          className="text-[11px] font-semibold bg-[#FBF6EC] text-[#0D1F3C] px-3 py-1 rounded-full hover:bg-[#C89D54] transition cursor-pointer shrink-0"
        >
          Crew Info
        </button>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[280px] bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${
                msg.isMe
                  ? 'bg-[#0D1F3C] text-white rounded-br-sm'
                  : 'bg-[#F5F6F8] text-[#111622] border border-[#E6E9EF] rounded-bl-sm'
              }`}
            >
              <p>{msg.text}</p>
            </div>
            <span className="text-[10px] text-[#5C667A] mt-1">
              {msg.sender} · {msg.time}
            </span>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 bg-[#F5F6F8] flex gap-1.5 overflow-x-auto border-t border-[#E6E9EF]">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSendMessage(chip)}
            className="text-[11px] font-semibold bg-white border border-[#DCE0E8] hover:border-[#C89D54] text-[#0D1F3C] px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#E6E9EF] flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Coordinate pickup spot..."
          className="flex-1 bg-[#F5F6F8] border border-[#DCE0E8] focus:border-[#0D1F3C] text-[#111622] rounded-xl px-3.5 py-2.5 text-xs outline-none"
        />
        <button
          type="submit"
          className="bg-[#0D1F3C] hover:bg-[#162E54] text-white text-xs font-bold px-4 rounded-xl transition cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
}