'use client';

import React, { useEffect, useState } from 'react';
import { HubType, Traveller, UserProfile } from '@/types/cabcircle';
import { ALL_HUBS, HUB_ROUTES } from '@/data/seedTravellers';

type TimePreset = 'Arriving now' | 'Within 30 min' | 'Choose time';

interface DiscoverFeedProps {
  currentUser?: UserProfile | null;
  selectedAirport?: string;
  onChangeHub?: (hubCode: string) => void;
  selectedRoute: string;
  onChangeRoute: (route: string) => void;
  travellers: Traveller[];
  onJoinCrew: (traveller: Traveller, partySize?: number) => void;
  onPostRoute: (
    customDestination: string,
    timeWindow: string,
    hubCode?: string,
    totalSeats?: number,
    luggageLabel?: string,
    autoOpenCrew?: boolean
  ) => void;
}

function formatLuggageSummary(checkInCount: number, cabinCount: number): string {
  const parts: string[] = [];
  if (checkInCount > 0) {
    parts.push(`${checkInCount} Check-in ${checkInCount === 1 ? 'Bag' : 'Bags'}`);
  }
  if (cabinCount > 0) {
    parts.push(`${cabinCount} Cabin ${cabinCount === 1 ? 'Bag' : 'Bags'}`);
  }
  return parts.length > 0 ? parts.join(' · ') : '1 Cabin Bag';
}

function matchesLuggageCounts(
  luggageText: string,
  checkInCount: number,
  cabinCount: number
): boolean {
  if (checkInCount === 0 && cabinCount === 0) return true;
  const lower = luggageText.toLowerCase();

  const hasHeavyOrCheckIn =
    lower.includes('suitcase') ||
    lower.includes('check-in') ||
    lower.includes('heavy') ||
    lower.includes('duffel') ||
    /\b[2-9]\b/.test(lower);

  if (checkInCount >= 2 || (checkInCount > 0 && cabinCount > 0)) {
    return hasHeavyOrCheckIn || lower.includes('1');
  }
  if (checkInCount === 1) {
    return hasHeavyOrCheckIn || lower.includes('cabin') || lower.includes('bag');
  }
  return true;
}

function toIsoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateBadge(isoDate: string): string {
  const todayIso = toIsoDate(0);
  const tomorrowIso = toIsoDate(1);
  if (isoDate === todayIso) return 'Today';
  if (isoDate === tomorrowIso) return 'Tomorrow';

  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function DiscoverFeed({
  currentUser,
  selectedAirport = 'BLR T1',
  onChangeHub,
  selectedRoute,
  onChangeRoute,
  travellers,
  onJoinCrew,
  onPostRoute,
}: DiscoverFeedProps) {
  const [step, setStep] = useState<'search' | 'feed'>('search');
  const [hubFilter, setHubFilter] = useState<'all' | HubType>('all');
  const [hubInput, setHubInput] = useState<string>(selectedAirport);
  const [dropInput, setDropInput] = useState<string>(
    selectedRoute === 'All Routes' ? '' : selectedRoute
  );
  const [hubFocused, setHubFocused] = useState(false);
  const [dropFocused, setDropFocused] = useState(false);

  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [checkInCount, setCheckInCount] = useState<number>(0);
  const [cabinCount, setCabinCount] = useState<number>(0);

  const [timePreset, setTimePreset] = useState<TimePreset>('Arriving now');
  const [selectedDate, setSelectedDate] = useState<string>(toIsoDate(0));
  const [customTime, setCustomTime] = useState<string>('10:30 PM – 11:00 PM');

  const [autoPostedBanner, setAutoPostedBanner] = useState(false);

  useEffect(() => {
    setHubInput(selectedAirport);
  }, [selectedAirport]);

  useEffect(() => {
    setDropInput(selectedRoute === 'All Routes' ? '' : selectedRoute);
  }, [selectedRoute]);

  const hubQuery = hubInput.trim().toLowerCase();
  const dropQuery = dropInput.trim().toLowerCase();

  const todayIso = toIsoDate(0);
  const tomorrowIso = toIsoDate(1);
  const dateLabel = formatDateBadge(selectedDate);

  const getEffectiveTimeWindow = (): string => {
    if (timePreset === 'Choose time') {
      const slot = customTime.trim() || '10:30 PM – 11:00 PM';
      return `${dateLabel} · ${slot}`;
    }
    return timePreset;
  };

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

  const popularDestinations = matchedHubObj
    ? HUB_ROUTES[matchedHubObj.code]?.map((r) => r.name).slice(0, 3) || []
    : ['Whitefield · ITPL', 'Electronic City', 'Indiranagar'];

  const matchingDropSuggestions = Object.values(HUB_ROUTES)
    .flat()
    .map((r) => r.name)
    .filter((v, i, arr) => arr.indexOf(v) === i)
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

    if (peopleCount > 1 && t.seatsLeft < peopleCount) return false;
    if (!matchesLuggageCounts(t.luggage, checkInCount, cabinCount)) return false;
    return true;
  });

  const handleFindPeopleClick = () => {
    const isInstantWindow =
      timePreset === 'Arriving now' || timePreset === 'Within 30 min';

    if (isInstantWindow) {
      const firstAvailable = visibleTravellers.find(
        (t) => t.seatsLeft >= peopleCount
      );

      if (firstAvailable) {
        setAutoPostedBanner(false);
        onJoinCrew(firstAvailable, peopleCount);
        return;
      }
    }

    if (visibleTravellers.length === 0) {
      const destinationToPost =
        dropInput.trim() || popularDestinations[0] || 'City Center';
      const windowLabel = getEffectiveTimeWindow();
      const luggageLabel = formatLuggageSummary(checkInCount, cabinCount);

      setAutoPostedBanner(true);
      onPostRoute(
        destinationToPost,
        windowLabel,
        hubInput.trim() || selectedAirport,
        Math.max(4, peopleCount + 1),
        luggageLabel,
        true
      );
      return;
    }

    setAutoPostedBanner(false);
    setStep('feed');
  };

  const myId = currentUser ? `user-${currentUser.phone}` : '';
  const hasAnyBag = checkInCount > 0 || cabinCount > 0;

  if (step === 'search') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="inline-flex bg-white p-1 rounded-full border border-[#E6E9EF]">
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
                onClick={() => setHubFilter(tab.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
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
              setAutoPostedBanner(false);
              setStep('feed');
            }}
            className="text-xs font-bold text-[#0D1F3C] hover:underline cursor-pointer"
          >
            Active Riders ({visibleTravellers.length}) →
          </button>
        </div>

        <div className="px-1 space-y-1">
          <h2 className="text-lg font-extrabold text-[#0D1F3C]">Where are you headed?</h2>
          <p className="text-xs text-[#5C667A]">
            We&apos;ll join a matching crew or post your trip automatically.
          </p>
        </div>

        {/* Pickup & Destination Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E6E9EF] shadow-sm space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label
                htmlFor="search-pickup-input"
                className="text-[11px] font-bold uppercase tracking-wider text-[#5C667A]"
              >
                Pickup Hub
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
              id="search-pickup-input"
              type="text"
              value={hubInput}
              onFocus={() => setHubFocused(true)}
              onBlur={() => setTimeout(() => setHubFocused(false), 150)}
              onChange={(e) => handleHubInputChange(e.target.value)}
              placeholder="Airport or railway station..."
              className="w-full bg-white text-[#111622] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] outline-none"
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
                      className="text-[11px] font-medium bg-[#F8FAFC] hover:bg-[#FBF6EC] text-[#0D1F3C] border border-[#CBD5E1] hover:border-[#C89D54] px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      {hub.code}
                    </button>
                  ))}
                </div>
              )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label
                htmlFor="search-dest-input"
                className="text-[11px] font-bold uppercase tracking-wider text-[#5C667A]"
              >
                Your Destination
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
              id="search-dest-input"
              type="text"
              value={dropInput}
              onFocus={() => setDropFocused(true)}
              onBlur={() => setTimeout(() => setDropFocused(false), 150)}
              onChange={(e) => handleDropInputChange(e.target.value)}
              placeholder="Where are you going?"
              className="w-full bg-white text-[#111622] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] outline-none"
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
                    className="text-[11px] font-medium bg-[#F8FAFC] hover:bg-[#FBF6EC] text-[#111622] border border-[#CBD5E1] hover:border-[#C89D54] px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C667A] px-1 block">
              Popular Destinations
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularDestinations.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleDropInputChange(item)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition cursor-pointer ${
                    dropInput.toLowerCase() === item.toLowerCase()
                      ? 'bg-[#FBF6EC] text-[#0D1F3C] border-[#0D1F3C]'
                      : 'bg-[#F5F6F8] text-[#111622] border-[#E6E9EF] hover:border-[#C89D54]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How Many People Stepper (1 to 6) */}
        <div className="bg-white rounded-3xl p-4 border border-[#E6E9EF] shadow-sm space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C667A]">
            How Many People?
          </p>
          <p className="text-[11px] text-[#5C667A]">
            Choose seats needed (1, 2, 3, 4+ travellers)
          </p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0D1F3C]">{peopleCount}</span>
              <span className="text-xs font-semibold text-[#5C667A]">
                {peopleCount === 1 ? 'person' : 'people total'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPeopleCount((n) => Math.max(1, n - 1))}
                className="w-9 h-9 rounded-full border border-[#CBD5E1] bg-[#F5F6F8] text-[#0D1F3C] font-bold text-base flex items-center justify-center hover:border-[#0D1F3C] cursor-pointer"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setPeopleCount((n) => Math.min(6, n + 1))}
                className="w-9 h-9 rounded-full bg-[#C89D54] text-[#0D1F3C] font-bold text-base flex items-center justify-center hover:bg-[#B88D44] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Luggage Count: Check-in Bag & Cabin Bag */}
        <div className="bg-white rounded-3xl p-4 border border-[#E6E9EF] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C667A]">
              Your Luggage
            </p>
            {hasAnyBag && (
              <button
                type="button"
                onClick={() => {
                  setCheckInCount(0);
                  setCabinCount(0);
                }}
                className="text-[11px] font-semibold text-[#5C667A] hover:text-[#0D1F3C] cursor-pointer"
              >
                Reset Bags
              </button>
            )}
          </div>

          <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E6E9EF] rounded-2xl px-3.5 py-2.5">
            <div>
              <p className="text-xs font-bold text-[#111622]">Check-in Bag</p>
              <p className="text-[11px] font-semibold text-[#5C667A]">
                {checkInCount} {checkInCount === 1 ? 'bag' : 'bags'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCheckInCount((n) => Math.max(0, n - 1))}
                className="w-8 h-8 rounded-full border border-[#CBD5E1] bg-white text-[#0D1F3C] font-bold text-sm flex items-center justify-center hover:border-[#0D1F3C] cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center text-xs font-extrabold text-[#0D1F3C]">
                {checkInCount}
              </span>
              <button
                type="button"
                onClick={() => setCheckInCount((n) => Math.min(6, n + 1))}
                className="w-8 h-8 rounded-full bg-[#C89D54] text-[#0D1F3C] font-bold text-sm flex items-center justify-center hover:bg-[#B88D44] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E6E9EF] rounded-2xl px-3.5 py-2.5">
            <div>
              <p className="text-xs font-bold text-[#111622]">Cabin Bag</p>
              <p className="text-[11px] font-semibold text-[#5C667A]">
                {cabinCount} {cabinCount === 1 ? 'bag' : 'bags'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCabinCount((n) => Math.max(0, n - 1))}
                className="w-8 h-8 rounded-full border border-[#CBD5E1] bg-white text-[#0D1F3C] font-bold text-sm flex items-center justify-center hover:border-[#0D1F3C] cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center text-xs font-extrabold text-[#0D1F3C]">
                {cabinCount}
              </span>
              <button
                type="button"
                onClick={() => setCabinCount((n) => Math.min(6, n + 1))}
                className="w-8 h-8 rounded-full bg-[#C89D54] text-[#0D1F3C] font-bold text-sm flex items-center justify-center hover:bg-[#B88D44] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* When Are You Travelling */}
        <div className="bg-white rounded-3xl p-4 border border-[#E6E9EF] shadow-sm space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C667A]">
            When Are You Travelling?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['Arriving now', 'Within 30 min', 'Choose time'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTimePreset(preset)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  timePreset === preset
                    ? 'bg-[#FBF6EC] text-[#0D1F3C] border-[#0D1F3C]'
                    : 'bg-white text-[#111622] border-[#E6E9EF] hover:border-[#C89D54]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {timePreset === 'Choose time' && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayIso)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                    selectedDate === todayIso
                      ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
                      : 'bg-[#F8FAFC] text-[#111622] border-[#E6E9EF]'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(tomorrowIso)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                    selectedDate === tomorrowIso
                      ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
                      : 'bg-[#F8FAFC] text-[#111622] border-[#E6E9EF]'
                  }`}
                >
                  Tomorrow
                </button>
                <input
                  type="date"
                  min={todayIso}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value || todayIso)}
                  className="flex-1 bg-[#F8FAFC] text-[#111622] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] outline-none"
                />
              </div>

              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="Time window (e.g. 09:00 AM – 09:30 AM)"
                className="w-full bg-[#F8FAFC] text-[#111622] text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#CBD5E1] focus:border-[#0D1F3C] outline-none"
              />
            </div>
          )}
        </div>

        {/* Primary Action */}
        <button
          type="button"
          onClick={handleFindPeopleClick}
          className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white text-xs font-bold py-3.5 rounded-2xl shadow-md transition cursor-pointer"
        >
          Find people going my way
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={() => {
            setAutoPostedBanner(false);
            setStep('search');
          }}
          className="text-xs font-bold text-[#0D1F3C] hover:underline cursor-pointer"
        >
          &lt; Edit Search
        </button>
      </div>

      {autoPostedBanner && (
        <div className="bg-[#FBF6EC] border border-[#C89D54]/50 rounded-2xl p-3">
          <p className="text-xs font-semibold text-[#0D1F3C]">
            No matching crew found — your route was posted automatically.
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#111622]">
            Matching Riders ({visibleTravellers.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              setHubInput('');
              setDropInput('');
              setPeopleCount(1);
              setCheckInCount(0);
              setCabinCount(0);
              setSelectedDate(toIsoDate(0));
              onChangeHub?.('');
              onChangeRoute('All Routes');
            }}
            className="text-xs font-semibold text-[#0D1F3C] hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>

        {visibleTravellers.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-[#E6E9EF] text-center space-y-2">
            <p className="text-sm font-bold text-[#111622]">No matching riders right now</p>
            <p className="text-xs text-[#5C667A]">
              Tap <span className="font-bold text-[#0D1F3C]">&lt; Edit Search</span> to search again or auto-post your route.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleTravellers.map((t) => {
              const hubLabel = t.hubName || t.airport || 'Hub';
              const badgeText = t.hubType === 'railway' ? 'Railway' : 'Airport';
              const isAlreadyJoined = myId ? t.members?.some((m) => m.id === myId) : false;
              const isFull = t.seatsLeft === 0;

              return (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-4 border border-[#E6E9EF] shadow-sm space-y-3"
                >
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
                        <p className="text-[11px] text-[#5C667A]">
                          {t.company} · {t.gender}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F5F6F8] rounded-2xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="text-[#5C667A]">Going to</span>
                      <span className="font-semibold text-[#111622] text-right">
                        {hubLabel} → {t.destination}
                      </span>
                    </div>
                    {t.pickupPoint && (
                      <div className="flex justify-between gap-2">
                        <span className="text-[#5C667A]">Pickup</span>
                        <span className="font-semibold text-[#111622] text-right">
                          {t.pickupPoint}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between gap-2">
                      <span className="text-[#5C667A]">Timing</span>
                      <span className="font-semibold text-[#111622]">{t.timeWindow}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#5C667A]">Luggage</span>
                      <span className="font-semibold text-[#0D1F3C]">{t.luggage}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-semibold text-[#5C667A]">
                      {isFull
                        ? 'Crew Full'
                        : `${t.seatsLeft} ${t.seatsLeft === 1 ? 'seat' : 'seats'} left`}
                    </span>

                    {isAlreadyJoined ? (
                      <button
                        type="button"
                        onClick={() => onJoinCrew(t, peopleCount)}
                        className="bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54] text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Joined ✓
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isFull}
                        onClick={() => onJoinCrew(t, peopleCount)}
                        className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition ${
                          isFull
                            ? 'bg-[#E6E9EF] text-[#8A94A6] cursor-not-allowed'
                            : 'bg-[#0D1F3C] hover:bg-[#162E54] text-white cursor-pointer'
                        }`}
                      >
                        {isFull ? 'Crew Full' : 'Join Crew →'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}