'use client';

import React, { useEffect, useState } from 'react';
import { AppTab, ChatMessage, CrewMember, HubType, Traveller, UserProfile } from '@/types/cabcircle';
import { ALL_HUBS, SEED_TRAVELLERS } from '@/data/seedTravellers';
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
    text: 'Hey! Just reached the pickup point. Sharing ride toward Koramangala.',
    time: '10:12 PM',
    isMe: false,
  },
];

function buildInitialMembers(traveller: Traveller): CrewMember[] {
  if (traveller.members && traveller.members.length > 0) {
    return traveller.members;
  }
  return [
    {
      id: `host-${traveller.id}`,
      name: traveller.name,
      initials: traveller.initials,
      role: 'Host',
      badge: traveller.company,
    },
  ];
}

export default function SahYatriPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('discover');
  const [selectedAirport, setSelectedAirport] = useState<string>('BLR T1');
  const [selectedRoute, setSelectedRoute] = useState<string>('All Routes');
  const [travellersList, setTravellersList] = useState<Traveller[]>(SEED_TRAVELLERS);

  const [matchedTravellerId, setMatchedTravellerId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  useEffect(() => {
    const restored = restoreActiveSession();
    if (restored) setCurrentUser(restored);
  }, []);

  const myId = currentUser ? `user-${currentUser.phone}` : '';

  const isUserInTraveller = (t: Traveller): boolean => {
    if (!myId) return false;
    return (
      t.members?.some((m) => m.id === myId || m.id.startsWith(`${myId}-guest-`)) ||
      false
    );
  };

  const activeCrew =
    travellersList.find(
      (t) => t.id === matchedTravellerId && isUserInTraveller(t)
    ) ||
    travellersList.find((t) => isUserInTraveller(t)) ||
    null;

  const handleHubChange = (hubCode: string) => {
    setSelectedAirport(hubCode);
    setSelectedRoute('All Routes');
  };

  const handleJoinCrew = (traveller: Traveller, partySize: number = 1) => {
    if (!currentUser) return;

    const userId = `user-${currentUser.phone}`;
    const myInitials =
      currentUser.fullName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'ME';

    const existingMembers = buildInitialMembers(traveller);
    const alreadyJoined = existingMembers.some((m) => m.id === userId);
    const maxMembers = traveller.maxMembers || existingMembers.length + traveller.seatsLeft;

    if (!alreadyJoined && traveller.seatsLeft < partySize) {
      return;
    }

    let updatedMembers = existingMembers;
    let updatedSeatsLeft = traveller.seatsLeft;

    if (!alreadyJoined) {
      const newMembersToAdd: CrewMember[] = [
        {
          id: userId,
          name: `${currentUser.fullName} (You)`,
          initials: myInitials,
          role: 'Member',
          badge: currentUser.companyBadge || 'Verified',
        },
      ];

      for (let i = 1; i < partySize; i += 1) {
        newMembersToAdd.push({
          id: `${userId}-guest-${i}`,
          name: `${currentUser.fullName.split(' ')[0]}'s Co-Traveller ${i}`,
          initials: `+${i}`,
          role: 'Member',
          badge: 'Same Party',
        });
      }

      updatedMembers = [...existingMembers, ...newMembersToAdd];
      updatedSeatsLeft = Math.max(0, traveller.seatsLeft - partySize);

      const isNowFull = updatedSeatsLeft === 0;
      const statusNote = isNowFull
        ? `${currentUser.fullName} joined (${updatedMembers.length}/${maxMembers} · Crew Full)`
        : `${currentUser.fullName} joined (${updatedMembers.length}/${maxMembers} · ${updatedSeatsLeft} ${
            updatedSeatsLeft === 1 ? 'seat' : 'seats'
          } left)`;

      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'System',
          initials: 'SY',
          text: statusNote,
          time: 'Just now',
          isMe: false,
          isSystem: true,
        },
      ]);
    }

    setTravellersList((prev) =>
      prev.map((item) =>
        item.id === traveller.id
          ? {
              ...item,
              maxMembers,
              members: updatedMembers,
              seatsLeft: updatedSeatsLeft,
            }
          : item
      )
    );

    setMatchedTravellerId(traveller.id);
    setActiveTab('match');
  };

  const handleLeaveCrew = (travellerId: string) => {
    if (!currentUser) return;
    const userId = `user-${currentUser.phone}`;

    setTravellersList((prev) =>
      prev.map((item) => {
        if (item.id !== travellerId) return item;
        const currentMembers = buildInitialMembers(item);
        const leavingCount = currentMembers.filter(
          (m) => m.id === userId || m.id.startsWith(`${userId}-guest-`)
        ).length;
        if (leavingCount === 0) return item;

        return {
          ...item,
          members: currentMembers.filter(
            (m) => m.id !== userId && !m.id.startsWith(`${userId}-guest-`)
          ),
          seatsLeft: item.seatsLeft + leavingCount,
        };
      })
    );

    setMessages((prev) => [
      ...prev,
      {
        id: `sys-leave-${Date.now()}`,
        sender: 'System',
        initials: 'SY',
        text: `${currentUser.fullName} left the crew`,
        time: 'Just now',
        isMe: false,
        isSystem: true,
      },
    ]);

    if (matchedTravellerId === travellerId) {
      setMatchedTravellerId('');
    }

    setActiveTab('discover');
  };

  const handlePostRoute = (
    customDestination: string,
    timeWindow: string,
    hubCode?: string,
    totalSeats: number = 3,
    luggageLabel: string = '1 Cabin Bag',
    autoOpenCrew: boolean = false
  ) => {
    if (!currentUser) return;
    const initials =
      currentUser.fullName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'SY';

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

    const userId = `user-${currentUser.phone}`;
    const maxMembers = Math.max(2, totalSeats);

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
      luggage: luggageLabel,
      cabMode: 'Uber / Ola',
      seatsLeft: maxMembers - 1,
      maxMembers,
      members: [
        {
          id: userId,
          name: `${currentUser.fullName} (You)`,
          initials,
          role: 'Host',
          badge: currentUser.companyBadge || 'Verified',
        },
      ],
      splitFare: null,
      soloFare: null,
      isFareEstimated: false,
      matchScore: 100,
    };

    setTravellersList((prev) => [newRideCard, ...prev]);
    setMatchedTravellerId(newRideCard.id);
    setSelectedAirport(targetHub);
    setSelectedRoute('All Routes');

    if (autoOpenCrew) {
      setActiveTab('match');
    }
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    const initials =
      currentUser.fullName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'ME';

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
    setMatchedTravellerId('');
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
            </header>

            <main className="flex-1 overflow-y-auto p-4 bg-[#F5F6F8]">
              {activeTab === 'discover' && (
                <DiscoverFeed
                  currentUser={currentUser}
                  selectedAirport={selectedAirport}
                  onChangeHub={handleHubChange}
                  selectedRoute={selectedRoute}
                  onChangeRoute={setSelectedRoute}
                  travellers={travellersList}
                  onJoinCrew={handleJoinCrew}
                  onPostRoute={handlePostRoute}
                />
              )}

              {activeTab === 'match' &&
                (activeCrew ? (
                  <CrewMatchView
                    currentUser={currentUser}
                    traveller={activeCrew}
                    onOpenChat={() => setActiveTab('chat')}
                    onLeaveCrew={() => handleLeaveCrew(activeCrew.id)}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-6 border border-[#E6E9EF] shadow-sm text-center space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FBF6EC] border border-[#C89D54]/40 text-[#0D1F3C] font-extrabold text-sm flex items-center justify-center mx-auto">
                      SY
                    </div>
                    <h2 className="text-base font-bold text-[#0D1F3C]">No Active Crew Yet</h2>
                    <p className="text-xs text-[#5C667A]">
                      You haven&apos;t joined a ride crew yet. Set your route to join one or start your own.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('discover')}
                      className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white text-xs font-bold py-3 rounded-2xl transition cursor-pointer"
                    >
                      Find My Ride →
                    </button>
                  </div>
                ))}

              {activeTab === 'chat' &&
                (activeCrew ? (
                  <CrewChatView
                    currentUser={currentUser}
                    traveller={activeCrew}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onBackToCrew={() => setActiveTab('match')}
                    onLeaveChat={() => setActiveTab('match')}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-6 border border-[#E6E9EF] shadow-sm text-center space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FBF6EC] border border-[#C89D54]/40 text-[#0D1F3C] font-extrabold text-sm flex items-center justify-center mx-auto">
                      💬
                    </div>
                    <h2 className="text-base font-bold text-[#0D1F3C]">No Crew Chat Available</h2>
                    <p className="text-xs text-[#5C667A]">
                      Join a ride crew first to coordinate pickup and ride details in chat.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('discover')}
                      className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white text-xs font-bold py-3 rounded-2xl transition cursor-pointer"
                    >
                      Find My Ride →
                    </button>
                  </div>
                ))}

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