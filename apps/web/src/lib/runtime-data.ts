import "server-only";

import { isMockMode } from "./mock-mode";

export async function ensureRuntimeUser() {
  if (isMockMode()) return;

  const { ensureDefaultLocalUser } = await import("./local-user");
  await ensureDefaultLocalUser();
}

export async function getRuntimeSession(requestHeaders: Headers) {
  if (isMockMode()) return null;

  const { auth } = await import("@kodan/auth");
  return auth.api.getSession({ headers: requestHeaders });
}
