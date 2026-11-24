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
  onLeaveChat?: () => void;
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
  onLeaveChat,
}: CrewChatViewProps) {
  const [draft, setDraft] = useState('');
  const [hasLeftChat, setHasLeftChat] = useState(false);

  const hubLabel = traveller.hubName || traveller.airport || 'Hub';
  const hubBadge = traveller.hubType === 'railway' ? 'Railway' : 'Airport';

  const joinedCount = traveller.members?.length || 1;
  const maxMembers = traveller.maxMembers || joinedCount + traveller.seatsLeft;
  const isFull = traveller.seatsLeft === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || hasLeftChat) return;
    onSendMessage(draft.trim());
    setDraft('');
  };

  const handleLeaveChatClick = () => {
    setHasLeftChat(true);
    onLeaveChat?.();
  };

  const handleRejoinChatClick = () => {
    setHasLeftChat(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#E6E9EF] shadow-sm overflow-hidden">
      <div className="p-3.5 bg-[#0D1F3C] text-white border-b border-[#C89D54]/30">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold truncate">
                {hubLabel} → {traveller.destination}
              </h3>
              <span className="text-[10px] font-bold bg-[#C89D54] text-[#0D1F3C] px-2 py-0.5 rounded-full shrink-0">
                {hubBadge}
              </span>
            </div>
            <p className="text-[11px] text-[#E5C285] truncate mt-0.5">
              {hasLeftChat
                ? 'You left this chat'
                : isFull
                ? `${joinedCount}/${maxMembers} Members · Crew Full`
                : `${joinedCount}/${maxMembers} Members · ${traveller.seatsLeft} ${
                    traveller.seatsLeft === 1 ? 'seat' : 'seats'
                  } left`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onBackToCrew}
              className="text-[11px] font-semibold bg-[#FBF6EC] text-[#0D1F3C] px-2.5 py-1 rounded-full hover:bg-[#C89D54] transition cursor-pointer"
            >
              Crew ({joinedCount}/{maxMembers})
            </button>

            {!hasLeftChat && (
              <button
                type="button"
                onClick={handleLeaveChatClick}
                className="text-[11px] font-bold bg-[#162E54] hover:bg-[#C89D54] text-[#E5C285] hover:text-[#0D1F3C] border border-[#C89D54]/40 px-2.5 py-1 rounded-full transition cursor-pointer"
              >
                Leave Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {hasLeftChat ? (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3 bg-[#F8FAFC]">
          <p className="text-sm font-bold text-[#0D1F3C]">You have left this chat</p>
          <p className="text-xs text-[#5C667A] max-w-[260px]">
            You won&apos;t send or receive live messages here unless you rejoin the chat.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleRejoinChatClick}
              className="bg-[#0D1F3C] hover:bg-[#162E54] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Rejoin Chat
            </button>
            <button
              type="button"
              onClick={onBackToCrew}
              className="bg-white border border-[#DCE0E8] text-[#0D1F3C] text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Back to Crew
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[280px] bg-white">
            {messages.map((msg) =>
              msg.isSystem ? (
                <div key={msg.id} className="flex justify-center">
                  <span className="text-[11px] font-semibold bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40 px-3 py-1 rounded-full">
                    {msg.text}
                  </span>
                </div>
              ) : (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                >
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
              )
            )}
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
        </>
      )}
    </div>
  );
}