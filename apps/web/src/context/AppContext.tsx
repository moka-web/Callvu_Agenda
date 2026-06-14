'use client';

import React, { createContext, useContext, useState } from 'react';
import { Cliente } from '@callvu-agenda/shared';

interface AppContextType {
  activeUser: Cliente | null;
  setActiveUser: (user: Cliente | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<Cliente | null>(null);

  return (
    <AppContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
