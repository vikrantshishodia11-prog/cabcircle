'use client';

import React, { useEffect, useState } from 'react';
import { AppTab, ChatMessage, HubType, Traveller, UserProfile } from '@/types/cabcircle';
import { ALL_HUBS, HUB_ROUTES, SEED_TRAVELLERS, estimateCabFare } from '@/data/seedTravellers';
import { clearActiveSession, restoreActiveSession } from '@/lib/storage';
import { AuthFlow } from '@/components/auth/AuthFlow';
import { DiscoverFeed } from '@/components/discover/DiscoverFeed';
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

  const [passengers, setPassengers] = useState<number>(3);
  const [luggageType, setLuggageType] = useState<'light' | 'heavy'>('light');

  const [matchedTraveller, setMatchedTraveller] = useState<Traveller>(SEED_TRAVELLERS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  useEffect(() => {
    const restored = restoreActiveSession();
    if (restored) setCurrentUser(restored);
  }, []);

  const allRoutes = Object.values(HUB_ROUTES).flat();
  const activeRouteMeta =
    allRoutes.find((r) => r.name.toLowerCase() === selectedRoute.toLowerCase()) ||
    allRoutes[0] || { name: selectedRoute, distanceKm: 24, toll: 0 };

  const handleHubChange = (hubCode: string) => {
    setSelectedAirport(hubCode);
    setSelectedRoute('All Routes');
  };

  const handleJoinCrew = (traveller: Traveller) => {
    setMatchedTraveller(traveller);
    setActiveTab('match');
  };

  const handlePostRoute = (
    customDestination: string,
    timeWindow: string,
    hubCode?: string
  ) => {
    if (!currentUser) return;
    const initials = currentUser.fullName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const targetHub = (hubCode || selectedAirport).trim() || 'BLR T1';
    const matchedHub = ALL_HUBS.find(
      (h) =>
        h.code.toLowerCase() === targetHub.toLowerCase() ||
        h.label.toLowerCase().includes(targetHub.toLowerCase())
    );
    const hubType: HubType =
      matchedHub?.hubType ||
      (targetHub.toLowerCase().includes('rail') ||
      targetHub.toLowerCase().includes('jn') ||
      targetHub.toLowerCase() === 'cdg' ||
      targetHub.toLowerCase() === 'ndls' ||
      targetHub.toLowerCase() === 'sbc' ||
      targetHub.toLowerCase() === 'sc'
        ? 'railway'
        : 'airport');

    const candidateRoutes = HUB_ROUTES[matchedHub?.code || targetHub] || allRoutes;
    const matchedRoute = candidateRoutes.find(
      (r) =>
        r.name.toLowerCase() === customDestination.toLowerCase() ||
        r.name.toLowerCase().includes(customDestination.toLowerCase())
    );

    const estimated = estimateCabFare({
      cabMode: 'Uber / Ola',
      distanceKm: matchedRoute ? matchedRoute.distanceKm : 20,
      toll: matchedRoute ? matchedRoute.toll : 0,
      passengers,
      isLargeVehicle: luggageType === 'heavy',
    });

    const newRideCard: Traveller = {
      id: `custom-${Date.now()}`,
      name: `${currentUser.fullName} (You)`,
      initials,
      color: '#0D1F3C',
      gender: currentUser.gender === 'Female' ? 'Female' : 'Male',
      company: currentUser.companyBadge || 'Email Verified',
      hubType,
      hubName: targetHub,
      airport: targetHub,
      pickupPoint: matchedHub?.pickupPoint || 'Main Exit / Pickup Zone',
      destination: customDestination,
      timeWindow,
      luggage: luggageType === 'heavy' ? '2 Check-in Suitcases' : '1 Cabin Bag',
      cabMode: 'Uber / Ola',
      seatsLeft: Math.max(1, passengers - 1),
      splitFare: estimated.perPersonMin,
      soloFare: estimated.maxTotal,
      isFareEstimated: true,
      matchScore: 100,
    };

    setTravellersList((prev) => [newRideCard, ...prev]);
    setSelectedAirport(targetHub);
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
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 bg-[#E6E9EF]">
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[820px] sm:h-[820px] bg-[#F5F6F8] sm:rounded-[36px] sm:shadow-2xl border border-[#DCE0E8] flex flex-col overflow-hidden">
        {!currentUser ? (
          <AuthFlow onAuthenticated={setCurrentUser} />
        ) : (
          <>
     <header className="px-5 pt-5 pb-3 bg-[#FFFFFF] border-b border-[#E6E9EF] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C89D54]" />
                  <span className="font-bold text-base tracking-tight text-[#0D1F3C]">SahYatri</span>
                </div>
                <p className="text-[11px] text-[#5C667A]">
                  Hi, <span className="font-semibold text-[#111622]">{currentUser.fullName.split(' ')[0]}</span>
                </p>
              </div>
              {/* <span className="text-[11px] font-semibold bg-[#FBF6EC] text-[#9A722E] border border-[#C89D54]/40 px-3 py-1 rounded-full">
                Airport · Railway
              </span> */}
            </header>

            <main className="flex-1 overflow-y-auto p-4 bg-[#F5F6F8]">
              {activeTab === 'discover' && (
                <DiscoverFeed
                  selectedAirport={selectedAirport}
                  onChangeHub={handleHubChange}
                  selectedRoute={selectedRoute}
                  onChangeRoute={setSelectedRoute}
                  travellers={travellersList}
                  onJoinCrew={handleJoinCrew}
                  onPostRoute={handlePostRoute}
                />
              )}

              {activeTab === 'match' && (
                <CrewMatchView
                  currentUser={currentUser}
                  traveller={matchedTraveller}
                  cabMode="Uber / Ola"
                  onChangeCabMode={() => {}}
                  onOpenChat={() => setActiveTab('chat')}
                />
              )}
              {activeTab === 'chat' && (
                <CrewChatView
                  currentUser={currentUser}
                  traveller={matchedTraveller}
                  cabMode="Uber / Ola"
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