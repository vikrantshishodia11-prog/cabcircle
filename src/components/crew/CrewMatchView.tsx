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
    <div className="bg-white rounded-3xl p-5 border border-[#E2E6DC] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider bg-[#E9F7BE] text-[#0F3D2E] px-3 py-1 rounded-full">
          Crew Matched
        </span>
        <span className="text-xs font-bold text-[#0F3D2E]">Est. ₹{traveller.splitFare} each</span>
      </div>

      <h2 className="text-xl font-bold text-[#111915]">
        {traveller.airport} → {traveller.destination}
      </h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between bg-[#F6F7F2] p-3 rounded-2xl">
          <div>
            <p className="text-sm font-bold text-[#111915]">{currentUser.fullName} (You)</p>
            <p className="text-[11px] text-[#5B665F]">{currentUser.email}</p>
          </div>
          <span className="text-[10px] font-bold bg-[#0F3D2E] text-white px-2.5 py-1 rounded-full">Ready</span>
        </div>

        <div className="flex items-center justify-between bg-[#F6F7F2] p-3 rounded-2xl">
          <div>
            <p className="text-sm font-bold text-[#111915]">{traveller.name}</p>
            <p className="text-[11px] text-[#5B665F]">{traveller.company}</p>
          </div>
          <span className="text-[10px] font-bold bg-[#E9F7BE] text-[#0F3D2E] px-2.5 py-1 rounded-full">Verified</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-[#111915] mb-2">Switch Cab Mode for Crew</p>
        <div className="grid grid-cols-2 gap-2">
          {CAB_MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChangeCabMode(m)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                cabMode === m
                  ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                  : 'bg-white text-[#3E4A43] border-[#DCE0D5]'
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
        className="w-full bg-[#0F3D2E] text-white font-semibold py-3.5 rounded-2xl"
      >
        Open Crew Coordination Chat →
      </button>
    </div>
  );
}