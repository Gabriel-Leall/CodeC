import type { Route } from "next";

export type AuthMode = "login" | "register";

export function getSafeCallbackPath(
  callbackURL: string | null | undefined,
  fallback: Route,
): Route {
  if (!callbackURL?.startsWith("/") || callbackURL.startsWith("//")) {
    return fallback;
  }

  return callbackURL as Route;
}

export function getLoginHref(callbackURL: string, mode: AuthMode = "login"): Route {
  const searchParams = new URLSearchParams({ mode, callbackURL });
  return `/login?${searchParams.toString()}` as Route;
}

export function getRegisterHref(callbackURL: string): Route {
  const searchParams = new URLSearchParams({ callbackURL });
  return `/cadastro?${searchParams.toString()}` as Route;
}
