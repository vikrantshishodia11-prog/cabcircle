export type GenderOption = 'Female' | 'Male' | 'Non-binary';

export type CabMode =
  | 'Uber / Ola'
  | 'Prepaid Taxi'
  | 'Local Cab'
  | 'Already Booked';

export type AuthStep = 'welcome' | 'otp' | 'profile_setup' | 'app';

export type AppTab = 'discover' | 'preferences' | 'match' | 'chat' | 'profile';

export interface UserProfile {
  phone: string;
  fullName: string;
  gender: GenderOption;
  email: string;
  companyBadge?: string;
}

export interface Traveller {
  id: string;
  name: string;
  initials: string;
  color: string;
  gender: 'Female' | 'Male';
  company: string;
  airport: string;
  destination: string;
  timeWindow: string;
  luggage: string;
  cabMode: CabMode;
  seatsLeft: number;
  splitFare: number | null;
  soloFare: number | null;
  matchScore: number;
 isFareEstimated?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  initials: string;
  text: string;
  time: string;
  isMe: boolean;
}