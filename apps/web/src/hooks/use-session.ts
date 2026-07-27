"use client";

import { useContext } from "react";
import { SessionContext } from "@/providers/session-provider";

export function useSession() {
  return useContext(SessionContext);
}