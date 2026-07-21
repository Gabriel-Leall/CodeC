"use client";

import { useEffect, useRef, useState } from "react";

import type { ZenTone } from "@kodan/ui/components/zen";

const INITIAL_TOAST = {
  open: false,
  tone: "info" as ZenTone,
  title: "Aviso",
  message: "",
};

function clearToastTimeouts(timeoutIdsRef: { current: number[] }) {
  timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
  timeoutIdsRef.current = [];
}

export function useZenToast() {
  const [toast, setToast] = useState(INITIAL_TOAST);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => () => clearToastTimeouts(timeoutIdsRef), []);

  const showToast = (tone: ZenTone, title: string, message: string) => {
    clearToastTimeouts(timeoutIdsRef);
    setToast({ open: false, tone, title, message });
    timeoutIdsRef.current.push(
      window.setTimeout(() => setToast({ open: true, tone, title, message }), 20),
      window.setTimeout(() => setToast((current) => ({ ...current, open: false })), 3200),
    );
  };

  return { toast, showToast };
}
