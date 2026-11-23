// src/components/crew/CrewMatchView.tsx
'use client';

import React from 'react';
import { CabMode, Traveller, UserProfile } from '@/types/cabcircle';

interface CrewMatchViewProps {
  currentUser: UserProfile;
  traveller: Traveller;
  cabMode?: CabMode;
  onChangeCabMode?: (mode: CabMode) => void;
  onOpenChat: () => void;
}

export function CrewMatchView({
  currentUser,
  traveller,
  onOpenChat,
}: CrewMatchViewProps) {
  const hubLabel = traveller.hubName || traveller.airport || 'Hub';
  const hubBadge = traveller.hubType === 'railway' ? 'Railway' : 'Airport';

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E6E9EF] shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40 px-3 py-1 rounded-full">
            Crew Matched
          </span>
          <span className="text-[10px] font-bold bg-[#0D1F3C] text-white px-2.5 py-1 rounded-full">
            {hubBadge}
          </span>
        </div>
        <span className="text-xs font-bold text-[#0D1F3C]">
          {traveller.matchScore}% Match
        </span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#111622]">
          {hubLabel} → {traveller.destination}
        </h2>
        <p className="text-xs text-[#5C667A] mt-0.5">
          Time Window: <span className="font-semibold text-[#111622]">{traveller.timeWindow}</span>
        </p>
      </div>

      <div className="bg-[#F5F6F8] border border-[#E6E9EF] rounded-2xl p-3 space-y-1.5 text-xs">
        {traveller.pickupPoint && (
          <div className="flex justify-between gap-2">
            <span className="text-[#5C667A]">Pickup Spot</span>
            <span className="font-semibold text-[#111622] text-right">{traveller.pickupPoint}</span>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="text-[#5C667A]">Luggage</span>
          <span className="font-semibold text-[#111622] text-right">{traveller.luggage}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-[#5C667A]">Seats Left</span>
          <span className="font-semibold text-[#0D1F3C]">
            {traveller.seatsLeft} {traveller.seatsLeft === 1 ? 'seat' : 'seats'}
          </span>
        </div>
      </div>

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