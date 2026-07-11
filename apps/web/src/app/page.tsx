import { auth } from "@kodan/auth";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import EntryGate from "./entry-gate";

export const metadata: Metadata = {
  title: "Kodan",
  description: "Entre no dojo e avance pelos desafios de React e TypeScript.",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSeenGate = cookieStore.get("dojo_gate_seen")?.value === "1";
  let hasSession = false;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    hasSession = Boolean(session);
  } catch {
    // Falha de sessão não bloqueia a tela inicial.
  }

  if (hasSession) {
    redirect("/challenges");
  }

  if (hasSeenGate) {
    redirect("/challenges");
  }

  return <EntryGate />;
}
