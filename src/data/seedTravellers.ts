import { CabMode, HubType, Traveller } from '@/types/cabcircle';

export interface RouteMeta {
  name: string;
  distanceKm: number;
  toll: number;
}

export interface HubOption {
  code: string;
  label: string;
  hubType: HubType;
  pickupPoint: string;
}

export const AIRPORTS = [
  { code: 'BLR T1', label: 'BLR · Terminal 1' },
  { code: 'BLR T2', label: 'BLR · Terminal 2' },
  { code: 'DEL T3', label: 'DEL · Terminal 3' },
  { code: 'HYD', label: 'HYD · Rajiv Gandhi' },
] as const;

export const RAILWAY_STATIONS = [
  { code: 'NDLS', label: 'New Delhi Railway Station' },
  { code: 'SBC', label: 'KSR Bengaluru (Majestic)' },
  { code: 'CDG', label: 'Chandigarh Jn · Railway' },
  { code: 'SC', label: 'Secunderabad Jn' },
] as const;

export const ALL_HUBS: HubOption[] = [
  ...AIRPORTS.map((a) => ({
    code: a.code,
    label: a.label,
    hubType: 'airport' as HubType,
    pickupPoint: 'Arrival Gate 2 · Cab Zone',
  })),
  ...RAILWAY_STATIONS.map((r) => ({
    code: r.code,
    label: r.label,
    hubType: 'railway' as HubType,
    pickupPoint: 'Main Exit · Prepaid & Cab Lane',
  })),
];

export const CAB_MODES: CabMode[] = [
  'Uber / Ola',
  'Prepaid Taxi',
  'Local Cab',
  'Already Booked',
];

export const AIRPORT_ROUTES: Record<string, RouteMeta[]> = {
  'BLR T1': [
    { name: 'Whitefield · ITPL', distanceKm: 42, toll: 110 },
    { name: 'Indiranagar · 100ft Rd', distanceKm: 38, toll: 110 },
    { name: 'HSR Layout · Sector 2', distanceKm: 48, toll: 110 },
    { name: 'Electronic City', distanceKm: 55, toll: 165 },
  ],
  'BLR T2': [
    { name: 'Koramangala · 4th Block', distanceKm: 44, toll: 110 },
    { name: 'MG Road · Central', distanceKm: 35, toll: 110 },
    { name: 'Whitefield · ITPL', distanceKm: 42, toll: 110 },
  ],
  'DEL T3': [
    { name: 'Cyber Hub · Gurugram', distanceKm: 18, toll: 0 },
    { name: 'Noida · Sector 62', distanceKm: 36, toll: 50 },
    { name: 'South Ex · Delhi', distanceKm: 16, toll: 0 },
  ],
  HYD: [
    { name: 'HITEC City · Madhapur', distanceKm: 34, toll: 60 },
    { name: 'Gachibowli', distanceKm: 30, toll: 60 },
    { name: 'Banjara Hills', distanceKm: 28, toll: 0 },
  ],
};

export const RAILWAY_ROUTES: Record<string, RouteMeta[]> = {
  NDLS: [
    { name: 'Connaught Place · Rajiv Chowk', distanceKm: 4, toll: 0 },
    { name: 'Cyber Hub · Gurugram', distanceKm: 29, toll: 0 },
    { name: 'Noida · Sector 62', distanceKm: 24, toll: 0 },
  ],
  SBC: [
    { name: 'Indiranagar · 100ft Rd', distanceKm: 8, toll: 0 },
    { name: 'Koramangala · 4th Block', distanceKm: 10, toll: 0 },
    { name: 'Whitefield · ITPL', distanceKm: 19, toll: 0 },
  ],
  CDG: [
    { name: 'Mohali · Phase 8', distanceKm: 14, toll: 0 },
    { name: 'Sector 17 · Chandigarh', distanceKm: 9, toll: 0 },
    { name: 'Zirakpur · VIP Road', distanceKm: 11, toll: 0 },
  ],
  SC: [
    { name: 'HITEC City · Madhapur', distanceKm: 16, toll: 0 },
    { name: 'Gachibowli', distanceKm: 19, toll: 0 },
    { name: 'Banjara Hills', distanceKm: 9, toll: 0 },
  ],
};

export const HUB_ROUTES: Record<string, RouteMeta[]> = {
  ...AIRPORT_ROUTES,
  ...RAILWAY_ROUTES,
};

// Automatically derived from HUB_ROUTES (Single Source of Truth)
export const POPULAR_DESTINATIONS: Record<string, string[]> = Object.fromEntries(
  Object.entries(HUB_ROUTES).map(([hub, routes]) => [
    hub,
    ['All Routes', ...routes.map((r) => r.name)],
  ])
);

export const SEED_TRAVELLERS: Traveller[] = [
  {
    id: 't1',
    name: 'Ananya Menon',
    initials: 'AM',
    color: '#0F3D2E',
    gender: 'Female',
    company: 'Infosys Verified',
    hubType: 'airport',
    hubName: 'BLR T1',
    airport: 'BLR T1',
    pickupPoint: 'Arrival Gate 2',
    destination: 'Whitefield · ITPL',
    timeWindow: '10:15 PM – 10:30 PM',
    luggage: '1 Cabin + 1 Check-in',
    cabMode: 'Uber / Ola',
    seatsLeft: 2,
    splitFare: 425,
    soloFare: 1280,
    matchScore: 98,
  },
  {
    id: 't2',
    name: 'Vikramaditya Rao',
    initials: 'VR',
    color: '#2B59C3',
    gender: 'Male',
    company: 'Atlassian Verified',
    hubType: 'airport',
    hubName: 'BLR T1',
    airport: 'BLR T1',
    pickupPoint: 'Arrival Gate 2',
    destination: 'Indiranagar · 100ft Rd',
    timeWindow: '10:20 PM – 10:40 PM',
    luggage: '1 Backpack',
    cabMode: 'Prepaid Taxi',
    seatsLeft: 2,
    splitFare: 390,
    soloFare: 1150,
    matchScore: 94,
  },
  {
    id: 't3',
    name: 'Sneha Kulkarni',
    initials: 'SK',
    color: '#7C3AED',
    gender: 'Female',
    company: 'Razorpay Verified',
    hubType: 'railway',
    hubName: 'SBC',
    airport: 'SBC',
    pickupPoint: 'Platform 1 Main Exit',
    destination: 'Koramangala · 4th Block',
    timeWindow: '10:30 PM – 10:50 PM',
    luggage: '1 Check-in Suitcase',
    cabMode: 'Already Booked',
    seatsLeft: 1,
    splitFare: 145,
    soloFare: 420,
    matchScore: 91,
  },
  {
    id: 't4',
    name: 'Karthik Nair',
    initials: 'KN',
    color: '#B45309',
    gender: 'Male',
    company: 'Email Verified',
    hubType: 'railway',
    hubName: 'CDG',
    airport: 'CDG',
    pickupPoint: 'Main Exit · Cab Stand',
    destination: 'Mohali · Phase 8',
    timeWindow: '10:10 PM – 10:30 PM',
    luggage: '2 Check-in Suitcases',
    cabMode: 'Local Cab',
    seatsLeft: 2,
    splitFare: 130,
    soloFare: 380,
    matchScore: 89,
  },
];

export function estimateCabFare(params: {
  cabMode: CabMode;
  distanceKm: number;
  toll: number;
  passengers: number;
  isLargeVehicle: boolean;
  customQuotedFare?: number | null;
}) {
  const {
    cabMode,
    distanceKm,
    toll,
    passengers,
    isLargeVehicle,
    customQuotedFare,
  } = params;

  const safePassengers = Math.max(1, passengers);

  if (customQuotedFare && customQuotedFare > 0) {
    return {
      minTotal: customQuotedFare,
      maxTotal: customQuotedFare,
      perPersonMin: Math.round(customQuotedFare / safePassengers),
      perPersonMax: Math.round(customQuotedFare / safePassengers),
      rateLabel: 'Rider Quoted / Locked Fare',
    };
  }

  const perKmRate =
    cabMode === 'Prepaid Taxi'
      ? isLargeVehicle ? 28 : 24
      : cabMode === 'Local Cab'
      ? isLargeVehicle ? 26 : 21
      : isLargeVehicle ? 29 : 23;

  const baseCharge = cabMode === 'Prepaid Taxi' ? 118 : 90;
  const rawTotal = baseCharge + distanceKm * perKmRate + toll;

  const minTotal = Math.round(rawTotal * 0.95);
  const maxTotal = Math.round(rawTotal * 1.08);

  return {
    minTotal,
    maxTotal,
    perPersonMin: Math.round(minTotal / safePassengers),
    perPersonMax: Math.round(maxTotal / safePassengers),
    rateLabel: `~${distanceKm} km · ₹${perKmRate}/km + ₹${toll} toll`,
  };
}