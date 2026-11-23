'use client';

import React, { useEffect, useState } from 'react';
import { AppTab, CabMode, ChatMessage, Traveller, UserProfile } from '@/types/cabcircle';
import { AIRPORTS, AIRPORT_ROUTES, SEED_TRAVELLERS, estimateCabFare } from '@/data/seedTravellers';
import { clearActiveSession, restoreActiveSession } from '@/lib/storage';
import { AuthFlow } from '@/components/auth/AuthFlow';
import { DiscoverFeed } from '@/components/discover/DiscoverFeed';
import { RidePreferences } from '@/components/preferences/RidePreferences';
import { CrewMatchView } from '@/components/crew/CrewMatchView';
import { CrewChatView } from '@/components/crew/CrewChatView';
import { ProfileView } from '@/components/profile/ProfileView';
import { BottomNav } from '@/components/layout/BottomNav';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'Ananya Menon',
    initials: 'AM',
    text: 'Hey! Just landed at T1. Collecting my bag from Belt 3.',
    time: '10:12 PM',
    isMe: false,
  },
  {
    id: 'm2',
    sender: 'Ananya Menon',
    initials: 'AM',
    text: 'Should we meet near Pillar 4 for the cab?',
    time: '10:13 PM',
    isMe: false,
  },
];

export default function SahYatriPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('discover');
  const [selectedAirport, setSelectedAirport] = useState<string>('BLR T1');
  const [selectedRoute, setSelectedRoute] = useState<string>('All Routes');
  const [travellersList, setTravellersList] = useState<Traveller[]>(SEED_TRAVELLERS);

  const [cabMode, setCabMode] = useState<CabMode>('Uber / Ola');
  const [passengers, setPassengers] = useState<number>(3);
  const [luggageType, setLuggageType] = useState<'light' | 'heavy'>('light');

  const [matchedTraveller, setMatchedTraveller] = useState<Traveller>(SEED_TRAVELLERS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  useEffect(() => {
    const restored = restoreActiveSession();
    if (restored) setCurrentUser(restored);
  }, []);

  const routeList = AIRPORT_ROUTES[selectedAirport] || [];
  const activeRouteMeta =
    routeList.find((r) => r.name === selectedRoute) ||
    routeList[0] || { name: selectedRoute, distanceKm: 38, toll: 110 };

  const handleAirportChange = (airportCode: string) => {
    setSelectedAirport(airportCode);
    setSelectedRoute('All Routes');
  };

  const handleJoinCrew = (traveller: Traveller) => {
    setMatchedTraveller(traveller);
    setCabMode(traveller.cabMode);
    setActiveTab('match');
  };

const handlePostRoute = (customDestination: string, timeWindow: string) => {
  if (!currentUser) return;
  const initials = currentUser.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const matchedRoute = (AIRPORT_ROUTES[selectedAirport] || []).find(
    (r) => r.name.toLowerCase() === customDestination.toLowerCase()
  );

  const estimated = matchedRoute
    ? estimateCabFare({
        cabMode,
        distanceKm: matchedRoute.distanceKm,
        toll: matchedRoute.toll,
        passengers,
        isLargeVehicle: luggageType === 'heavy',
      })
    : null;

  const newRideCard: Traveller = {
    id: `custom-${Date.now()}`,
    name: `${currentUser.fullName} (You)`,
    initials,
    color: '#0F3D2E',
    gender: currentUser.gender === 'Female' ? 'Female' : 'Male',
    company: currentUser.companyBadge || 'Email Verified',
    airport: selectedAirport,
    destination: customDestination,
    timeWindow,
    luggage: luggageType === 'heavy' ? '2 Check-in Suitcases' : '1 Cabin Bag',
    cabMode,
    seatsLeft: passengers - 1,
    splitFare: estimated ? estimated.perPersonMin : null,
    soloFare: estimated ? estimated.maxTotal : null,
    isFareEstimated: true,
    matchScore: 100,
  };

  setTravellersList((prev) => [newRideCard, ...prev]);
  setSelectedRoute('All Routes');
};

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    const initials = currentUser.fullName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: currentUser.fullName,
        initials,
        text,
        time: 'Just now',
        isMe: true,
      },
    ]);
  };

  const handleLogout = () => {
    clearActiveSession();
    setCurrentUser(null);
    setActiveTab('discover');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 bg-[#ECEEE7]">
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[820px] sm:h-[820px] bg-[#F6F7F2] sm:rounded-[36px] sm:shadow-2xl border border-[#DCE0D5] flex flex-col overflow-hidden">
        {!currentUser ? (
          <AuthFlow onAuthenticated={setCurrentUser} />
        ) : (
          <>
            <header className="px-5 pt-5 pb-3 bg-[#F6F7F2] border-b border-[#E5E8DF] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F3D2E]" />
                  <span className="font-bold text-base tracking-tight text-[#0F3D2E]">SahYatri</span>
                </div>
                <p className="text-[11px] text-[#5B665F]">
                  Hi, <span className="font-semibold text-[#111915]">{currentUser.fullName.split(' ')[0]}</span> · {selectedAirport}
                </p>
              </div>
              <select
                value={selectedAirport}
                onChange={(e) => handleAirportChange(e.target.value)}
                className="bg-white border border-[#DCE0D5] text-xs font-semibold text-[#0F3D2E] rounded-full px-3 py-1.5 outline-none"
              >
                {AIRPORTS.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.label}
                  </option>
                ))}
              </select>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
              {activeTab === 'discover' && (
                <DiscoverFeed
                  selectedAirport={selectedAirport}
                  selectedRoute={selectedRoute}
                  onChangeRoute={setSelectedRoute}
                  travellers={travellersList}
                  onJoinCrew={handleJoinCrew}
                  onPostRoute={handlePostRoute}
                />
              )}
              {activeTab === 'preferences' && (
                <RidePreferences
                  distanceKm={activeRouteMeta.distanceKm}
                  toll={activeRouteMeta.toll}
                  cabMode={cabMode}
                  onChangeCabMode={setCabMode}
                  passengers={passengers}
                  onChangePassengers={setPassengers}
                  luggageType={luggageType}
                  onChangeLuggage={setLuggageType}
                  onApply={() => setActiveTab('discover')}
                />
              )}
              {activeTab === 'match' && (
                <CrewMatchView
                  currentUser={currentUser}
                  traveller={matchedTraveller}
                  cabMode={cabMode}
                  onChangeCabMode={setCabMode}
                  onOpenChat={() => setActiveTab('chat')}
                />
              )}
              {activeTab === 'chat' && (
                <CrewChatView
                  currentUser={currentUser}
                  traveller={matchedTraveller}
                  cabMode={cabMode}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onBackToCrew={() => setActiveTab('match')}
                />
              )}
              {activeTab === 'profile' && (
                <ProfileView user={currentUser} onLogout={handleLogout} />
              )}
            </main>

            <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
          </>
        )}
      </div>
    </div>
  );
}