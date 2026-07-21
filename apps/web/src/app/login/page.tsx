import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeCallbackPath, type AuthMode } from "@/lib/auth-navigation";
import { getRuntimeSession } from "@/lib/runtime-data";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; callbackURL?: string }>;
}) {
  const params = await searchParams;
  const callbackURL = getSafeCallbackPath(params.callbackURL, "/dashboard");
  const initialMode: AuthMode = params.mode === "register" ? "register" : "login";
  const session = await getRuntimeSession(await headers());

  if (session?.user) {
    redirect(getSafeCallbackPath(params.callbackURL, "/dashboard"));
  }

  return (
    <main className="grid min-h-svh place-items-center bg-[var(--profile-bg)] px-4 py-10 text-[var(--profile-text-primary)]">
      <LoginForm initialMode={initialMode} callbackURL={callbackURL} />
    </main>
  );
}
