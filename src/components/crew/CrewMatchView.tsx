// src/components/crew/CrewMatchView.tsx
'use client';

import React from 'react';
import { CabMode, Traveller, UserProfile } from '@/types/cabcircle';
import { CAB_MODES } from '@/data/seedTravellers';

interface CrewMatchViewProps {
  currentUser: UserProfile;
  traveller: Traveller;
  cabMode: CabMode;
  onChangeCabMode: (mode: CabMode) => void;
  onOpenChat: () => void;
}

export function CrewMatchView({
  currentUser,
  traveller,
  cabMode,
  onChangeCabMode,
  onOpenChat,
}: CrewMatchViewProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E6E9EF] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40 px-3 py-1 rounded-full">
          Crew Matched
        </span>
        <span className="text-xs font-bold text-[#0D1F3C]">
          {traveller.splitFare ? `Est. ₹${traveller.splitFare} each` : 'Fare split on route'}
        </span>
      </div>

      <h2 className="text-xl font-bold text-[#111622]">
        {traveller.airport} → {traveller.destination}
      </h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between bg-[#F5F6F8] border border-[#E6E9EF] p-3 rounded-2xl">
          <div>
            <p className="text-sm font-bold text-[#111622]">{currentUser.fullName} (You)</p>
            <p className="text-[11px] text-[#5C667A]">{currentUser.email}</p>
          </div>
          <span className="text-[10px] font-bold bg-[#0D1F3C] text-white px-2.5 py-1 rounded-full">
            Ready
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#F5F6F8] border border-[#E6E9EF] p-3 rounded-2xl">
          <div>
            <p className="text-sm font-bold text-[#111622]">{traveller.name}</p>
            <p className="text-[11px] text-[#5C667A]">{traveller.company}</p>
          </div>
          <span className="text-[10px] font-bold bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40 px-2.5 py-1 rounded-full">
            Verified
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-[#111622] mb-2">Switch Cab Mode for Crew</p>
        <div className="grid grid-cols-2 gap-2">
          {CAB_MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChangeCabMode(m)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                cabMode === m
                  ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
                  : 'bg-white text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenChat}
        className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white font-semibold py-3.5 rounded-2xl shadow-md transition cursor-pointer"
      >
        Open Crew Coordination Chat →
      </button>
    </div>
  );
}