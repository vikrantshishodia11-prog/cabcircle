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
  { id: 'preferences', label: 'Cab Mode' },
  { id: 'match', label: 'Crew' },
  { id: 'chat', label: 'Chat' },
  { id: 'profile', label: 'Profile' },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav className="bg-white border-t border-[#E5E8DF] px-2 py-2.5 grid grid-cols-5 text-center">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectTab(item.id)}
          className={`py-1.5 rounded-xl text-[11px] font-bold transition ${
            activeTab === item.id
              ? 'bg-[#0F3D2E] text-[#C6F432]'
              : 'text-[#5B665F] hover:text-[#111915]'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}