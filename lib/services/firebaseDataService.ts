import { DataService, Mosque, PrayerTimes, Need, MosqueEvent } from "../types";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --------------------------------------------------------
// INSTRUCTIONS:
// 1. Go to Firebase Console -> Project Settings -> General
// 2. Scroll down to "Your apps" and select "SDK setup and configuration" -> "Config"
// 3. Paste the config object below.
// --------------------------------------------------------

interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const firebaseConfig: FirebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_PROJECT_ID.appspot.com",
  // messagingSenderId: "YOUR_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

// Initialize Firebase only if config is present and no app exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
let auth: any;

if (firebaseConfig.apiKey && !getApps().length) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export const FirebaseDataService: DataService = {
  getMosques: async () => {
    if (!db) throw new Error("Firebase not configured");
    const snapshot = await getDocs(collection(db, "mosques"));
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Mosque,
    );
  },

  getMosqueById: async (id: string) => {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "mosques", id);
    const snap = await getDoc(docRef);
    return snap.exists()
      ? ({ id: snap.id, ...snap.data() } as Mosque)
      : undefined;
  },

  getPrayerTimes: async (mosqueId: string) => {
    if (!db) throw new Error("Firebase not configured");
    // Assuming prayer times are in a subcollection or separate collection
    const docRef = doc(db, "prayerTimes", mosqueId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as PrayerTimes) : undefined;
  },

  updatePrayerTimes: async (mosqueId, times) => {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "prayerTimes", mosqueId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(docRef, times as any);
  },

  updateMosqueProfile: async (id, data) => {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "mosques", id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(docRef, data as any);
  },

  login: async () => {
    // In a real app, we would pass password too.
    // This is just a placeholder to match the interface.
    // Auth state management is usually handled via onAuthStateChanged in a Context.
    console.warn(
      "Direct login via service is not standard for Firebase. Use AuthContext.",
    );
    return null;
  },

  // Needs CRUD
  getNeeds: async () => {
    if (!db) throw new Error("Firebase not configured");
    const snapshot = await getDocs(collection(db, "needs"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Need);
  },

  getNeedsByMosque: async (mosqueId: string) => {
    if (!db) throw new Error("Firebase not configured");
    const q = query(collection(db, "needs"), where("mosqueId", "==", mosqueId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Need);
  },

  createNeed: async (need) => {
    if (!db) throw new Error("Firebase not configured");
    const docRef = await addDoc(collection(db, "needs"), {
      ...need,
      createdAt: new Date().toISOString().split("T")[0],
    });
    return {
      id: docRef.id,
      ...need,
      createdAt: new Date().toISOString().split("T")[0],
    } as Need;
  },

  updateNeed: async (id, data) => {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "needs", id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(docRef, data as any);
  },

  deleteNeed: async (id) => {
    if (!db) throw new Error("Firebase not configured");
    await deleteDoc(doc(db, "needs", id));
  },

  // Events CRUD
  getEvents: async () => {
    if (!db) throw new Error("Firebase not configured");
    const snapshot = await getDocs(collection(db, "events"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as MosqueEvent);
  },

  getEventsByMosque: async (mosqueId: string) => {
    if (!db) throw new Error("Firebase not configured");
    const q = query(
      collection(db, "events"),
      where("mosqueId", "==", mosqueId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as MosqueEvent);
  },

  createEvent: async (event) => {
    if (!db) throw new Error("Firebase not configured");
    const docRef = await addDoc(collection(db, "events"), event);
    return { id: docRef.id, ...event } as MosqueEvent;
  },

  updateEvent: async (id, data) => {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, "events", id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(docRef, data as any);
  },

  deleteEvent: async (id) => {
    if (!db) throw new Error("Firebase not configured");
    await deleteDoc(doc(db, "events", id));
  },
};
