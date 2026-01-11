// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from 'firebase/auth';

export type Role = 'VISITOR' | 'SUPERVISOR' | 'ADMIN';

export interface Mosque {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  services: string[];
  imageUrl?: string;
  supervisorId?: string;
}

export interface PrayerTimes {
  mosqueId: string;
  fajr: string; // "HH:mm"
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  iqamahOffsets: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  jumuah: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  managedMosqueId?: string;
}

export interface DataService {
  getMosques: () => Promise<Mosque[]>;
  getMosqueById: (id: string) => Promise<Mosque | undefined>;
  getPrayerTimes: (mosqueId: string) => Promise<PrayerTimes | undefined>;
  updatePrayerTimes: (mosqueId: string, times: Partial<PrayerTimes>) => Promise<void>;
  updateMosqueProfile: (id: string, data: Partial<Mosque>) => Promise<void>;
  // Auth simulation
  login: (email: string) => Promise<AppUser | null>;
}
