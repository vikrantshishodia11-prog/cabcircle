'use client';

import React, { useEffect, useState } from 'react';
import { HubType, Traveller } from '@/types/cabcircle';
import { ALL_HUBS, HUB_ROUTES } from '@/data/seedTravellers';

interface DiscoverFeedProps {
  selectedAirport?: string;
  onChangeHub?: (hubCode: string) => void;
  selectedRoute: string;
  onChangeRoute: (route: string) => void;
  travellers: Traveller[];
  onJoinCrew: (traveller: Traveller) => void;
  onPostRoute: (customDestination: string, timeWindow: string, hubCode?: string) => void;
}

export function DiscoverFeed({
  selectedAirport = 'BLR T1',
  onChangeHub,
  selectedRoute,
  onChangeRoute,
  travellers,
  onJoinCrew,
  onPostRoute,
}: DiscoverFeedProps) {
  const [hubFilter, setHubFilter] = useState<'all' | HubType>('all');
  const [hubInput, setHubInput] = useState<string>(selectedAirport);
  const [dropInput, setDropInput] = useState<string>(
    selectedRoute === 'All Routes' ? '' : selectedRoute
  );
  const [hubFocused, setHubFocused] = useState(false);
  const [dropFocused, setDropFocused] = useState(false);
  const [womenOnly, setWomenOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [customDest, setCustomDest] = useState('');
  const [customTime, setCustomTime] = useState('10:30 PM – 11:00 PM');

  useEffect(() => {
    setHubInput(selectedAirport);
  }, [selectedAirport]);

  useEffect(() => {
    setDropInput(selectedRoute === 'All Routes' ? '' : selectedRoute);
  }, [selectedRoute]);

  const hubQuery = hubInput.trim().toLowerCase();
  const dropQuery = dropInput.trim().toLowerCase();

  const matchingHubSuggestions = ALL_HUBS.filter((h) => {
    if (hubFilter !== 'all' && h.hubType !== hubFilter) return false;
    if (!hubQuery) return true;
    return (
      h.code.toLowerCase().includes(hubQuery) ||
      h.label.toLowerCase().includes(hubQuery)
    );
  }).slice(0, 4);

  const matchedHubObj = ALL_HUBS.find(
    (h) =>
      h.code.toLowerCase() === hubQuery ||
      h.label.toLowerCase().includes(hubQuery)
  );

  const allDropNames = matchedHubObj
    ? HUB_ROUTES[matchedHubObj.code]?.map((r) => r.name) || []
    : Object.values(HUB_ROUTES)
        .flat()
        .map((r) => r.name)
        .filter((v, i, arr) => arr.indexOf(v) === i);

  const matchingDropSuggestions = allDropNames
    .filter((dest) => (!dropQuery ? true : dest.toLowerCase().includes(dropQuery)))
    .slice(0, 4);

  const handleHubInputChange = (val: string) => {
    setHubInput(val);
    onChangeHub?.(val.trim() || 'BLR T1');
  };

  const handleDropInputChange = (val: string) => {
    setDropInput(val);
    onChangeRoute(val.trim() ? val.trim() : 'All Routes');
  };

  const handleHubTypeChange = (nextType: 'all' | HubType) => {
    setHubFilter(nextType);
    if (nextType !== 'all') {
      const firstHub = ALL_HUBS.find((h) => h.hubType === nextType);
      if (firstHub && matchedHubObj?.hubType !== nextType) {
        setHubInput(firstHub.code);
        onChangeHub?.(firstHub.code);
      }
    }
  };

  const visibleTravellers = travellers.filter((t) => {
    const travellerHub = (t.hubName || t.airport || '').toLowerCase();
    const travellerType: HubType =
      t.hubType ||
      (ALL_HUBS.find((h) => h.code.toLowerCase() === travellerHub)?.hubType ??
        'airport');

    if (hubFilter !== 'all' && travellerType !== hubFilter) return false;

    if (hubQuery) {
      const hubMatches =
        travellerHub.includes(hubQuery) ||
        (t.pickupPoint || '').toLowerCase().includes(hubQuery);
      if (!hubMatches) return false;
    }

    if (dropQuery && dropQuery !== 'all routes') {
      if (!t.destination.toLowerCase().includes(dropQuery)) return false;
    }

    if (womenOnly && t.gender !== 'Female') return false;
    if (verifiedOnly && !t.company.includes('Verified')) return false;
    return true;
  });

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDest = (customDest || dropInput).trim();
    if (!finalDest) return;
    onPostRoute(finalDest, customTime, hubInput.trim() || selectedAirport);
    setCustomDest('');
    setDropInput(finalDest);
    onChangeRoute(finalDest);
    setShowPostForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Ola/Uber Style Clean Search Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#E6E9EF] shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex bg-[#F5F6F8] p-1 rounded-full border border-[#E6E9EF]">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'airport', label: 'Airport' },
                { id: 'railway', label: 'Railway' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleHubTypeChange(tab.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                  hubFilter === tab.id
                    ? 'bg-[#0D1F3C] text-white'
                    : 'text-[#5C667A] hover:text-[#111622]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (!customDest && dropInput) setCustomDest(dropInput);
              setShowPostForm((prev) => !prev);
            }}
            className="text-[11px] font-bold bg-[#C89D54] hover:bg-[#B88D44] text-[#0D1F3C] px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap"
          >
            {showPostForm ? 'Close' : '+ Post My Route'}
          </button>
        </div>

        {/* Pickup Input Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label
              htmlFor="pickup-hub-input"
              className="text-[11px] font-bold uppercase tracking-wider text-[#5C667A]"
            >
              Pickup (Airport / Station)
            </label>
            {hubInput && (
              <button
                type="button"
                onClick={() => handleHubInputChange('')}
                className="text-[11px] font-semibold text-[#5C667A] hover:text-[#0D1F3C] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <input
            id="pickup-hub-input"
            type="text"
            value={hubInput}
            onFocus={() => setHubFocused(true)}
            onBlur={() => setTimeout(() => setHubFocused(false), 150)}
            onChange={(e) => handleHubInputChange(e.target.value)}
            placeholder="Type airport or railway station..."
            className="w-full bg-white text-[#111622] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] focus:ring-2 focus:ring-[#0D1F3C]/10 outline-none placeholder:font-normal placeholder:text-[#8A94A6]"
          />

          {(hubFocused || hubQuery.length > 0) &&
            matchingHubSuggestions.length > 0 &&
            hubQuery !== matchingHubSuggestions[0].code.toLowerCase() && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchingHubSuggestions.map((hub) => (
                  <button
                    key={hub.code}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleHubInputChange(hub.code);
                      setHubFocused(false);
                    }}
                    className="text-[11px] font-medium bg-[#F8FAFC] hover:bg-[#FBF6EC] text-[#0D1F3C] border border-[#CBD5E1] hover:border-[#C89D54] px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    {hub.code} · {hub.hubType === 'railway' ? 'Railway' : 'Airport'}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Drop Input Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label
              htmlFor="drop-location-input"
              className="text-[11px] font-bold uppercase tracking-wider text-[#5C667A]"
            >
              Drop Location
            </label>
            {dropInput && (
              <button
                type="button"
                onClick={() => handleDropInputChange('')}
                className="text-[11px] font-semibold text-[#5C667A] hover:text-[#0D1F3C] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <input
            id="drop-location-input"
            type="text"
            value={dropInput}
            onFocus={() => setDropFocused(true)}
            onBlur={() => setTimeout(() => setDropFocused(false), 150)}
            onChange={(e) => handleDropInputChange(e.target.value)}
            placeholder="Where do you want to go?"
            className="w-full bg-white text-[#111622] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] focus:ring-2 focus:ring-[#0D1F3C]/10 outline-none placeholder:font-normal placeholder:text-[#8A94A6]"
          />

          {(dropFocused || dropQuery.length > 0) && matchingDropSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {matchingDropSuggestions.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleDropInputChange(dest);
                    setDropFocused(false);
                  }}
                  className="text-[11px] font-medium bg-[#F8FAFC] hover:bg-[#FBF6EC] text-[#111622] border border-[#CBD5E1] hover:border-[#C89D54] px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  {dest}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Post Custom Route Drawer */}
        {showPostForm && (
          <form onSubmit={handleCreateRoute} className="pt-2.5 border-t border-[#E6E9EF] space-y-2.5">
            <input
              type="text"
              value={customDest}
              onChange={(e) => setCustomDest(e.target.value)}
              placeholder="Confirm your drop location"
              className="w-full bg-white text-[#111622] text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] outline-none"
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="flex-1 bg-white text-[#111622] text-xs px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] outline-none"
              />
              <button
                type="submit"
                className="bg-[#0D1F3C] hover:bg-[#162E54] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
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
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition cursor-pointer ${
            womenOnly
              ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
              : 'bg-white text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
          }`}
        >
          Women-Only Crew
        </button>
        <button
          type="button"
          onClick={() => setVerifiedOnly((prev) => !prev)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition cursor-pointer ${
            verifiedOnly
              ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
              : 'bg-white text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
          }`}
        >
          Corporate Verified
        </button>
      </div>

      {/* Matching Co-Traveller Cards */}
      {visibleTravellers.length === 0 ? (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E9EF] text-center space-y-2">
          <p className="text-sm font-bold text-[#111622]">No active riders match this search yet</p>
          <p className="text-xs text-[#5C667A]">
            Clear search or tap <span className="font-semibold text-[#0D1F3C]">+ Post My Route</span> so co-travellers can join you.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleTravellers.map((t) => {
            const hubLabel = t.hubName || t.airport || 'Hub';
            const badgeText = t.hubType === 'railway' ? 'Railway' : 'Airport';

            return (
              <div key={t.id} className="bg-white rounded-3xl p-4 border border-[#E6E9EF] shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: t.color || '#0D1F3C' }}
                      className="w-11 h-11 rounded-2xl text-white font-bold text-sm flex items-center justify-center shrink-0"
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-[#111622]">{t.name}</h3>
                        <span className="text-[10px] font-bold bg-[#0D1F3C] text-white px-2 py-0.5 rounded-full">
                          {badgeText}
                        </span>
                        <span className="text-[10px] font-semibold bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40 px-2 py-0.5 rounded-full">
                          {t.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5C667A]">{t.company} · {t.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F5F6F8] rounded-2xl p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C667A]">Route</span>
                    <span className="font-semibold text-[#111622] text-right">{hubLabel} → {t.destination}</span>
                  </div>
                  {t.pickupPoint && (
                    <div className="flex justify-between gap-2">
                      <span className="text-[#5C667A]">Pickup</span>
                      <span className="font-semibold text-[#111622] text-right">{t.pickupPoint}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C667A]">Window</span>
                    <span className="font-semibold text-[#111622]">{t.timeWindow}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C667A]">Luggage</span>
                    <span className="font-semibold text-[#0D1F3C]">{t.luggage}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-semibold text-[#5C667A]">
                    {t.seatsLeft} {t.seatsLeft === 1 ? 'seat' : 'seats'} left
                  </span>
                  <button
                    type="button"
                    onClick={() => onJoinCrew(t)}
                    className="bg-[#0D1F3C] hover:bg-[#162E54] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Join Crew →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}