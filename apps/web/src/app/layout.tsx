import type { Metadata } from "next";

import "../index.css";
import { AppShell } from "../components/app-shell";
import Providers from "../components/providers";
import { getCurrentUser } from "../server/api/service";

export const metadata: Metadata = {
  title: "Kodan",
  description: "Treine sua mente para ler, interpretar e diagnosticar problemas complexos em código React.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let sidebarUser: { name: string; image: string | null; elo: number } | null = null;

  try {
    const userResult = await getCurrentUser();
    if (userResult.success && userResult.data) {
      sidebarUser = {
        name: userResult.data.name,
        image: userResult.data.image,
        elo: userResult.data.elo,
      };
    }
  } catch {
    // Em build/prerender sem schema aplicado, não bloqueia renderização inicial.
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <Providers>
          <AppShell user={sidebarUser}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
