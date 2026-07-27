"use client";

import { createContext } from "react";
import type { ReactNode } from "react";

type Session = {
  user: {
    id: string;
    name: string;
    email: string;
  };
} | null;

type SessionProviderProps = {
  children: ReactNode;
  session: Session;
};

export const SessionContext = createContext<Session>(null);

export function SessionProvider({
  children,
  session,
}: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}