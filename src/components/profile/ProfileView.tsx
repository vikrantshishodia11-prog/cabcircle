// src/components/profile/ProfileView.tsx
'use client';

import React from 'react';
import { UserProfile } from '@/types/cabcircle';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
}

export function ProfileView({ user, onLogout }: ProfileViewProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2E6DC] space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-[#0F3D2E] text-[#C6F432] font-bold text-lg flex items-center justify-center">
          {user.fullName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111915]">{user.fullName}</h2>
          <p className="text-xs text-[#5B665F]">+91 {user.phone} · {user.gender}</p>
          {user.companyBadge && (
            <span className="inline-block mt-1 text-[10px] font-bold bg-[#E9F7BE] text-[#0F3D2E] px-2.5 py-0.5 rounded-full">
              {user.companyBadge}
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#F6F7F2] rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-[#5B665F]">Billing &amp; Alert Email</span>
          <span className="text-[10px] font-bold text-[#0F3D2E] bg-[#E9F7BE] px-2 py-0.5 rounded-full">
            Invoices Active
          </span>
        </div>
        <p className="font-semibold text-[#111915]">{user.email}</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="w-full py-3 rounded-2xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50"
      >
        Log Out (Test Auto-Detect Login)
      </button>
    </div>
  );
}