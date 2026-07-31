import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@kodan/ui";
import { AuthActionFeedbackProvider } from "./auth-action-feedback";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthActionFeedbackProvider>
        {children}
        <Toaster position="bottom-left" closeButton richColors />
      </AuthActionFeedbackProvider>
    </ThemeProvider>
  );
}
