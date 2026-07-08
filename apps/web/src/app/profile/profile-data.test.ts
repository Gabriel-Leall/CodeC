import { describe, expect, it } from "bun:test";

import {
  buildStaticProfileViewModel,
  clampProficiency,
  getProfileRankLabel,
} from "./profile-data";

describe("profile-data", () => {
  it("builds the study dossier contract from the visual spec", () => {
    const viewModel = buildStaticProfileViewModel();

    expect(viewModel.user.name).toBe("Nakamura");
    expect(viewModel.user.rank).toBe("RONIN");
    expect(viewModel.user.elo).toBe(1687);
    expect(viewModel.stats).toHaveLength(5);
    expect(viewModel.topicMastery).toHaveLength(5);
    expect(viewModel.recentSessions).toHaveLength(5);
    expect(viewModel.recommendations).toHaveLength(5);
    expect(viewModel.achievements).toHaveLength(4);
  });

  it("keeps proficiency values inside progress bar bounds", () => {
    expect(clampProficiency(-12)).toBe(0);
    expect(clampProficiency(74)).toBe(74);
    expect(clampProficiency(200)).toBe(100);
  });

  it("maps ELO into profile rank labels", () => {
    expect(getProfileRankLabel(900)).toBe("KYU");
    expect(getProfileRankLabel(1687)).toBe("RONIN");
    expect(getProfileRankLabel(1900)).toBe("SENSEI");
  });
});
