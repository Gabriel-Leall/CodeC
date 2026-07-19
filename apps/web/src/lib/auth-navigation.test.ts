import { describe, expect, test } from "bun:test";

import { getLoginHref, getSafeCallbackPath } from "./auth-navigation";

describe("auth navigation", () => {
  test("keeps local callback paths", () => {
    expect(String(getSafeCallbackPath("/train/react-hooks?step=2", "/dashboard"))).toBe(
      "/train/react-hooks?step=2",
    );
  });

  test("rejects external and protocol-relative callbacks", () => {
    expect(getSafeCallbackPath("https://evil.example", "/dashboard")).toBe(
      "/dashboard",
    );
    expect(getSafeCallbackPath("//evil.example", "/dashboard")).toBe(
      "/dashboard",
    );
  });

  test("builds a registration link with an encoded return path", () => {
    expect(getLoginHref("/train/challenge-1", "register")).toBe(
      "/login?mode=register&callbackURL=%2Ftrain%2Fchallenge-1",
    );
  });
});
