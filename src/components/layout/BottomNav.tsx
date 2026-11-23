// src/components/layout/BottomNav.tsx
'use client';

import React from 'react';
import { AppTab } from '@/types/cabcircle';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'match', label: 'Crew' },
  { id: 'chat', label: 'Chat' },
  { id: 'profile', label: 'Profile' },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav className="bg-white border-t border-[#E6E9EF] px-2 py-2.5 grid grid-cols-4 gap-1 text-center">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectTab(item.id)}
          className={`py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
            activeTab === item.id
              ? 'bg-[#0D1F3C] text-[#E5C285] shadow-xs'
              : 'text-[#5C667A] hover:text-[#111622] hover:bg-[#F5F6F8]'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}