import "server-only";

import { toNextJsHandler } from "better-auth/next-js";

export async function getAuthRouteHandlers() {
  const { auth } = await import("@kodan/auth");
  return toNextJsHandler(auth);
}
