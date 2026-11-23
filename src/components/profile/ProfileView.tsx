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
    <div className="bg-white rounded-3xl p-5 border border-[#E6E9EF] shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-[#0D1F3C] text-[#E5C285] border border-[#C89D54]/40 font-bold text-lg flex items-center justify-center">
          {user.fullName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111622]">{user.fullName}</h2>
          <p className="text-xs text-[#5C667A]">
            +91 {user.phone} · {user.gender}
          </p>
          {user.companyBadge && (
            <span className="inline-block mt-1 text-[10px] font-bold bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40 px-2.5 py-0.5 rounded-full">
              {user.companyBadge}
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#F5F6F8] border border-[#E6E9EF] rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-[#5C667A]">Billing &amp; Alert Email</span>
          <span className="text-[10px] font-bold text-[#0D1F3C] bg-[#FBF6EC] border border-[#C89D54]/40 px-2 py-0.5 rounded-full">
            Invoices Active
          </span>
        </div>
        <p className="font-semibold text-[#111622]">{user.email}</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="w-full py-3 rounded-2xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition cursor-pointer"
      >
        Log Out (Test Auto-Detect Login)
      </button>
    </div>
  );
}