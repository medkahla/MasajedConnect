import { DataService, Mosque, PrayerTimes, AppUser } from '../types';

// Mock Data
const MOCK_MOSQUES: Mosque[] = [
  {
    id: "m1",
    name: "Masjid Al-Nour",
    description: "Une belle mosquée au centre-ville.",
    address: "123 Rue de la Paix",
    city: "Paris",
    latitude: 48.8566,
    longitude: 2.3522,
    services: ["WOMEN_SECTION", "ARABIC_CLASSES"],
    imageUrl: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&q=80&w=1000",
    supervisorId: "u1"
  },
  {
    id: "m2",
    name: "Grande Mosquée de Lyon",
    description: "Centre culturel et religieux.",
    address: "146 Boulevard Pinel",
    city: "Lyon",
    latitude: 45.7485,
    longitude: 4.8467,
    services: ["PARKING", "LIBRARY", "ACCESSIBILITY"],
    supervisorId: "u2"
  },
  {
    id: "m3",
    name: "Masjid Al-Fath",
    description: "Petit mosquée de quartier.",
    address: "45 Avenue de la République",
    city: "Marseille",
    latitude: 43.2965,
    longitude: 5.3698,
    services: ["FUNERAL_WASHING"],
    supervisorId: "u3"
  }
];

const MOCK_PRAYER_TIMES: Record<string, PrayerTimes> = {
  "m1": {
    mosqueId: "m1",
    fajr: "05:30",
    dhuhr: "13:00",
    asr: "16:45",
    maghrib: "20:30",
    isha: "22:00",
    iqamahOffsets: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    jumuah: "13:30"
  },
  "m2": {
    mosqueId: "m2",
    fajr: "05:35",
    dhuhr: "13:00",
    asr: "16:50",
    maghrib: "20:35",
    isha: "22:10",
    iqamahOffsets: { fajr: 30, dhuhr: 10, asr: 10, maghrib: 5, isha: 10 },
    jumuah: "13:15"
  }
};

const MOCK_USERS: AppUser[] = [
  { id: "u1", email: "imam@nour.com", name: "Imam Ahmed", role: "SUPERVISOR", managedMosqueId: "m1" },
  { id: "admin", email: "admin@masajed.com", name: "Admin", role: "ADMIN" }
];

export const MockDataService: DataService = {
  getMosques: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_MOSQUES), 500));
  },

  getMosqueById: async (id: string) => {
    return new Promise((resolve) => {
      const mosque = MOCK_MOSQUES.find(m => m.id === id);
      setTimeout(() => resolve(mosque), 300);
    });
  },

  getPrayerTimes: async (mosqueId: string) => {
    return new Promise((resolve) => {
      const times = MOCK_PRAYER_TIMES[mosqueId] || {
        mosqueId,
        fajr: "06:00", dhuhr: "13:00", asr: "17:00", maghrib: "20:00", isha: "21:30",
        iqamahOffsets: { fajr: 15, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
        jumuah: "13:00"
      };
      setTimeout(() => resolve(times), 300);
    });
  },

  updatePrayerTimes: async (mosqueId, times) => {
    console.log(`[MOCK] Updated prayer times for ${mosqueId}`, times);
    if (MOCK_PRAYER_TIMES[mosqueId]) {
      MOCK_PRAYER_TIMES[mosqueId] = { ...MOCK_PRAYER_TIMES[mosqueId], ...times };
    }
    return Promise.resolve();
  },

  updateMosqueProfile: async (id, data) => {
    console.log(`[MOCK] Updated mosque ${id}`, data);
    const idx = MOCK_MOSQUES.findIndex(m => m.id === id);
    if (idx !== -1) {
      MOCK_MOSQUES[idx] = { ...MOCK_MOSQUES[idx], ...data };
    }
    return Promise.resolve();
  },

  login: async (email) => {
    return new Promise((resolve) => {
      const user = MOCK_USERS.find(u => u.email === email);
      // For demo convenience, if user not found, return a generic visitor/supervisor
      if (!user) {
         // Auto-create a mock supervisor for testing
         resolve({
           id: "temp-user",
           email,
           name: "Demo User",
           role: "SUPERVISOR",
           managedMosqueId: "m1" // Give them control of M1 for demo
         });
      } else {
        resolve(user);
      }
    });
  }
};
