// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from "firebase/auth";

export type Role = "VISITOR" | "SUPERVISOR" | "ADMIN";

// Need types
export type NeedCategory =
  | "ELECTRICIAN"
  | "PLUMBER"
  | "LABOR"
  | "FINANCING"
  | "CONSTRUCTION"
  | "CLEANING"
  | "OTHER";
export type NeedStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

// Event types
export type EventCategory =
  | "RELIGIOUS"
  | "EDUCATIONAL"
  | "COMMUNITY"
  | "CHARITY"
  | "OTHER";

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

export interface Need {
  id: string;
  mosqueId: string;
  category: NeedCategory;
  title: string;
  description: string;
  status: NeedStatus;
  createdAt: string;
  contactEmail?: string;
}

export interface MosqueEvent {
  id: string;
  mosqueId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: EventCategory;
}

export interface DataService {
  getMosques: () => Promise<Mosque[]>;
  getMosqueById: (id: string) => Promise<Mosque | undefined>;
  getPrayerTimes: (mosqueId: string) => Promise<PrayerTimes | undefined>;
  updatePrayerTimes: (
    mosqueId: string,
    times: Partial<PrayerTimes>,
  ) => Promise<void>;
  updateMosqueProfile: (id: string, data: Partial<Mosque>) => Promise<void>;
  // Auth simulation
  login: (email: string) => Promise<AppUser | null>;
  // Needs
  getNeeds: () => Promise<Need[]>;
  getNeedsByMosque: (mosqueId: string) => Promise<Need[]>;
  createNeed: (need: Omit<Need, "id" | "createdAt">) => Promise<Need>;
  updateNeed: (id: string, data: Partial<Need>) => Promise<void>;
  deleteNeed: (id: string) => Promise<void>;
  // Events
  getEvents: () => Promise<MosqueEvent[]>;
  getEventsByMosque: (mosqueId: string) => Promise<MosqueEvent[]>;
  createEvent: (event: Omit<MosqueEvent, "id">) => Promise<MosqueEvent>;
  updateEvent: (id: string, data: Partial<MosqueEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}
