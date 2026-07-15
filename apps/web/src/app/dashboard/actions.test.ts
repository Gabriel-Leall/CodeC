import { beforeEach, describe, expect, mock, test } from "bun:test";

const serviceCalls = {
  getChallengeById: mock(async () => ({ success: true })),
  getCurrentUser: mock(async () => ({ success: true })),
  listChallenges: mock(async () => ({ success: true })),
  listCurrentUserAttempts: mock(async () => ({ success: true })),
  submitChallengeAttempt: mock(async () => ({ success: true })),
  updateCurrentUserProfile: mock(async () => ({ success: true })),
};

mock.module("@/server/api/service", () => serviceCalls);

const getRuntimeSession = mock(async () => null);
mock.module("@/lib/runtime-data", () => ({ getRuntimeSession }));
mock.module("@/lib/mock-mode", () => ({ isMockMode: () => false }));
mock.module("next/headers", () => ({ headers: async () => new Headers() }));

const {
  getAttemptsHistory,
  getChallenge,
  getChallenges,
  getLocalUser,
  submitAttempt,
  updateLocalUserProfile,
} = await import("./actions");

describe("dashboard server actions", () => {
  beforeEach(() => {
    getRuntimeSession.mockClear();
    Object.values(serviceCalls).forEach((serviceCall) => serviceCall.mockClear());
  });

  test("reject unauthenticated callers before service work", async () => {
    const actions = [
      () => getLocalUser(),
      () => updateLocalUserProfile({ name: "Gabriel" }),
      () => getChallenges(),
      () => getChallenge("challenge-1"),
      () => submitAttempt("challenge-1", "Uma resposta suficientemente detalhada."),
      () => getAttemptsHistory(),
    ];

    for (const action of actions) {
      await expect(action()).rejects.toThrow("Unauthorized");
    }

    expect(getRuntimeSession).toHaveBeenCalledTimes(actions.length);
    for (const serviceCall of Object.values(serviceCalls)) {
      expect(serviceCall).not.toHaveBeenCalled();
    }
  });
});
