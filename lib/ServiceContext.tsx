"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { DataService, AppUser } from './types';
import { MockDataService } from './services/mockDataService';
import { FirebaseDataService } from './services/firebaseDataService';

// TOGGLE THIS TO SWITCH BETWEEN MOCK AND REAL
const USE_MOCK = true;

const ServiceContext = createContext<{ service: DataService; user: AppUser | null; setUser: (u: AppUser | null) => void } | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const service = USE_MOCK ? MockDataService : FirebaseDataService;
  const [user, setUser] = useState<AppUser | null>(null);

  return (
    <ServiceContext.Provider value={{ service, user, setUser }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("useService must be used within ServiceProvider");
  return context;
};
