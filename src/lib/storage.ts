import { UserProfile } from '@/types/cabcircle';

const USERS_KEY = 'sahyatri_users_v1';
const SESSION_KEY = 'sahyatri_session_v1';

const DEMO_RETURNING_USER: UserProfile = {
  phone: '9999999999',
  fullName: 'Rohan Sharma',
  gender: 'Male',
  email: 'rohan.sharma@infosys.com',
  companyBadge: 'Infosys Verified',
};

function readUsersMap(): Record<string, UserProfile> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};
    if (!parsed[DEMO_RETURNING_USER.phone]) {
      parsed[DEMO_RETURNING_USER.phone] = DEMO_RETURNING_USER;
    }
    return parsed;
  } catch {
    return { [DEMO_RETURNING_USER.phone]: DEMO_RETURNING_USER };
  }
}

export function findUserByPhone(phone: string): UserProfile | null {
  const users = readUsersMap();
  return users[phone] ?? null;
}

export function saveUserAndSession(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  const users = readUsersMap();
  users[profile.phone] = profile;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, profile.phone);
}

export function restoreActiveSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const activePhone = localStorage.getItem(SESSION_KEY);
  return activePhone ? findUserByPhone(activePhone) : null;
}

export function clearActiveSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function extractCompanyBadge(email: string): string | undefined {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  const publicDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
  ];
  if (!domain || publicDomains.includes(domain)) return undefined;
  const brand = domain.split('.')[0];
  return `${brand.charAt(0).toUpperCase() + brand.slice(1)} Verified`;
}