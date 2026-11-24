'use client';

import React from 'react';
import { CabMode, CrewMember, Traveller, UserProfile } from '@/types/cabcircle';

interface CrewMatchViewProps {
  currentUser: UserProfile;
  traveller: Traveller;
  cabMode?: CabMode;
  onChangeCabMode?: (mode: CabMode) => void;
  onOpenChat: () => void;
  onLeaveCrew?: () => void;
}

export function CrewMatchView({
  currentUser,
  traveller,
  onOpenChat,
  onLeaveCrew,
}: CrewMatchViewProps) {
  const hubLabel = traveller.hubName || traveller.airport || 'Hub';
  const hubBadge = traveller.hubType === 'railway' ? 'Railway' : 'Airport';

  const members: CrewMember[] =
    traveller.members && traveller.members.length > 0
      ? traveller.members
      : [
          {
            id: `host-${traveller.id}`,
            name: traveller.name,
            initials: traveller.initials,
            role: 'Host',
            badge: traveller.company,
          },
          {
            id: `user-${currentUser.phone}`,
            name: `${currentUser.fullName} (You)`,
            initials: currentUser.fullName.slice(0, 2).toUpperCase(),
            role: 'Member',
            badge: currentUser.companyBadge || 'Verified',
          },
        ];

  const maxMembers = traveller.maxMembers || members.length + traveller.seatsLeft;
  const isFull = traveller.seatsLeft === 0;
  const openSlotsCount = Math.max(0, maxMembers - members.length);

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E6E9EF] shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isFull
                ? 'bg-[#0D1F3C] text-[#E5C285] border-[#0D1F3C]'
                : 'bg-[#FBF6EC] text-[#0D1F3C] border-[#C89D54]/40'
            }`}
          >
            {isFull ? 'Crew Full' : 'Crew Active'}
          </span>
          <span className="text-[10px] font-bold bg-[#0D1F3C] text-white px-2.5 py-1 rounded-full">
            {hubBadge}
          </span>
        </div>

        <span className="text-xs font-extrabold text-[#0D1F3C]">
          {members.length}/{maxMembers} Joined
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
          <span className="text-[#5C667A]">Availability</span>
          <span className={`font-bold ${isFull ? 'text-emerald-700' : 'text-[#0D1F3C]'}`}>
            {isFull
              ? 'All seats filled — ready to depart'
              : `${traveller.seatsLeft} ${traveller.seatsLeft === 1 ? 'seat' : 'seats'} still open`}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#111622]">
            Crew Members ({members.length}/{maxMembers})
          </span>
          {!isFull && (
            <span className="text-[11px] font-semibold text-[#9A722E]">
              +{openSlotsCount} open {openSlotsCount === 1 ? 'spot' : 'spots'}
            </span>
          )}
        </div>

        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-[#F5F6F8] border border-[#E6E9EF] p-3 rounded-2xl"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#0D1F3C] text-[#E5C285] text-xs font-bold flex items-center justify-center shrink-0">
                {member.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111622] truncate">{member.name}</p>
                <p className="text-[11px] text-[#5C667A] truncate">
                  {member.badge || 'Verified Co-Traveller'}
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                member.role === 'Host'
                  ? 'bg-[#0D1F3C] text-white'
                  : 'bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40'
              }`}
            >
              {member.role}
            </span>
          </div>
        ))}

        {Array.from({ length: openSlotsCount }).map((_, idx) => (
          <div
            key={`open-slot-${idx}`}
            className="flex items-center justify-between border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3 rounded-2xl"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl border border-dashed border-[#94A3B8] text-[#8A94A6] text-xs font-bold flex items-center justify-center">
                +
              </div>
              <div>
                <p className="text-xs font-semibold text-[#5C667A]">Open Co-Traveller Slot</p>
                <p className="text-[10px] text-[#8A94A6]">Waiting for rider on same route</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#8A94A6]">Empty</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onOpenChat}
          className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white font-semibold py-3.5 rounded-2xl shadow-md transition cursor-pointer"
        >
          Open Crew Coordination Chat →
        </button>

        {onLeaveCrew && (
          <button
            type="button"
            onClick={onLeaveCrew}
            className="w-full py-2.5 rounded-2xl border border-[#DCE0E8] text-[#5C667A] hover:text-red-600 hover:border-red-200 text-xs font-semibold transition cursor-pointer"
          >
            Leave Crew
          </button>
        )}
      </div>
    </div>
  );
}