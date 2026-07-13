import type { Metadata } from "next";
import { JetBrains_Mono, Courier_Prime } from "next/font/google";

import "../index.css";
import { AppShell } from "../components/app-shell";
import Providers from "../components/providers";
import { ensureDefaultLocalUser } from "../lib/local-user";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kodan",
  description: "Treine sua mente para ler, interpretar e diagnosticar problemas complexos em código React.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    await ensureDefaultLocalUser();
  } catch {
    // Em build/prerender sem schema aplicado, não bloqueia renderização inicial.
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${jetbrainsMono.variable} ${courierPrime.variable} antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
