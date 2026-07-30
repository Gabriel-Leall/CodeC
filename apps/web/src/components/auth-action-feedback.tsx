"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "@kodan/ui";

type AuthActionFeedback = {
  startAuthAction: (message: string) => void;
  finishAuthAction: () => void;
  showAuthError: (message: string) => void;
};

const AuthActionFeedbackContext = createContext<AuthActionFeedback | null>(null);

export function AuthActionFeedbackProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const value: AuthActionFeedback = {
    startAuthAction: setMessage,
    finishAuthAction: () => setMessage(null),
    showAuthError: (errorMessage) => toast.error("Não foi possível concluir a ação", { description: errorMessage }),
  };

  return (
    <AuthActionFeedbackContext.Provider value={value}>
      {children}
      {message ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 p-6 backdrop-blur-[2px]" role="status" aria-live="polite" aria-label={message}>
          <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-2xl dark:bg-slate-900 dark:text-slate-100">
            <LoaderCircle className="size-5 animate-spin text-[#2783c0]" aria-hidden="true" />
            {message}
          </div>
        </div>
      ) : null}
    </AuthActionFeedbackContext.Provider>
  );
}

export function useAuthActionFeedback() {
  const feedback = useContext(AuthActionFeedbackContext);
  if (!feedback) throw new Error("useAuthActionFeedback deve ser usado dentro de AuthActionFeedbackProvider");
  return feedback;
}
