'use client';

import React, { useState } from 'react';
import { Traveller } from '@/types/cabcircle';
import { POPULAR_DESTINATIONS } from '@/data/seedTravellers';

interface DiscoverFeedProps {
  selectedAirport: string;
  selectedRoute: string;
  onChangeRoute: (route: string) => void;
  travellers: Traveller[];
  onJoinCrew: (traveller: Traveller) => void;
  onPostRoute: (customDestination: string, timeWindow: string) => void;
}

export function DiscoverFeed({
  selectedAirport,
  selectedRoute,
  onChangeRoute,
  travellers,
  onJoinCrew,
  onPostRoute,
}: DiscoverFeedProps) {
  const [womenOnly, setWomenOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [customDest, setCustomDest] = useState('');
  const [customTime, setCustomTime] = useState('10:30 PM – 11:00 PM');

  const airportRoutes = POPULAR_DESTINATIONS[selectedAirport] || ['All Routes'];

  const visibleTravellers = travellers.filter((t) => {
    if (t.airport !== selectedAirport) return false;
    if (selectedRoute !== 'All Routes' && t.destination !== selectedRoute) return false;
    if (womenOnly && t.gender !== 'Female') return false;
    if (verifiedOnly && !t.company.includes('Verified')) return false;
    return true;
  });

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDest.trim()) return;
    onPostRoute(customDest.trim(), customTime);
    setCustomDest('');
    setShowPostForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Route Selector Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E6DC] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B665F]">
            Your Airport Route
          </span>
          <button
            type="button"
            onClick={() => setShowPostForm((prev) => !prev)}
            className="text-[11px] font-bold bg-[#C6F432] text-[#0F3D2E] px-3 py-1 rounded-full"
          >
            {showPostForm ? 'Close' : '+ Post My Route'}
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[#F6F7F2] border border-[#DCE0D5] rounded-2xl px-3.5 py-2.5">
          <span className="text-xs font-extrabold text-[#0F3D2E] whitespace-nowrap">
            {selectedAirport} →
          </span>
          <select
            value={selectedRoute}
            onChange={(e) => onChangeRoute(e.target.value)}
            className="bg-transparent text-xs font-semibold text-[#111915] w-full outline-none"
          >
            {airportRoutes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>

        {/* Post Custom Route Drawer */}
        {showPostForm && (
          <form onSubmit={handleCreateRoute} className="pt-2 border-t border-[#E5E8DF] space-y-2.5">
            <input
              type="text"
              value={customDest}
              onChange={(e) => setCustomDest(e.target.value)}
              placeholder="Enter drop area (e.g. Bellandur, Marathahalli)"
              className="w-full bg-[#F6F7F2] border border-[#DCE0D5] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0F3D2E]"
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="flex-1 bg-[#F6F7F2] border border-[#DCE0D5] rounded-xl px-3 py-2 text-xs outline-none"
              />
              <button
                type="submit"
                className="bg-[#0F3D2E] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Publish
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Safety & Verification Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setWomenOnly((prev) => !prev)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition ${
            womenOnly
              ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
              : 'bg-white text-[#3E4A43] border-[#DCE0D5]'
          }`}
        >
          Women-Only Crew
        </button>
        <button
          type="button"
          onClick={() => setVerifiedOnly((prev) => !prev)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition ${
            verifiedOnly
              ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
              : 'bg-white text-[#3E4A43] border-[#DCE0D5]'
          }`}
        >
          Corporate Verified
        </button>
      </div>

      {/* Matching Co-Traveller Cards */}
      {visibleTravellers.length === 0 ? (
        <div className="bg-white rounded-3xl p-6 border border-[#E2E6DC] text-center space-y-2">
          <p className="text-sm font-bold text-[#111915]">No active riders on this exact route yet</p>
          <p className="text-xs text-[#5B665F]">
            Tap <span className="font-semibold text-[#0F3D2E]">+ Post My Route</span> above so incoming flyers can match with you.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleTravellers.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl p-4 border border-[#E2E6DC] shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: t.color }}
                    className="w-11 h-11 rounded-2xl text-white font-bold text-sm flex items-center justify-center"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-[#111915]">{t.name}</h3>
                      <span className="text-[10px] font-semibold bg-[#E9F7BE] text-[#0F3D2E] px-2 py-0.5 rounded-full">
                        {t.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5B665F]">{t.company} · {t.gender}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#0F3D2E]">₹{t.splitFare}</span>
                  <span className="block text-[10px] line-through text-[#8B958E]">₹{t.soloFare}</span>
                </div>
              </div>

              <div className="bg-[#F6F7F2] rounded-2xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5B665F]">Route</span>
                  <span className="font-semibold text-[#111915]">{t.airport} → {t.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B665F]">Window</span>
                  <span className="font-semibold text-[#111915]">{t.timeWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B665F]">Cab &amp; Bags</span>
                  <span className="font-semibold text-[#0F3D2E]">{t.cabMode} · {t.luggage}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-[#5B665F]">
                  {t.seatsLeft} {t.seatsLeft === 1 ? 'seat' : 'seats'} left
                </span>
                <button
                  type="button"
                  onClick={() => onJoinCrew(t)}
                  className="bg-[#0F3D2E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#165440]"
                >
                  Join Crew →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}