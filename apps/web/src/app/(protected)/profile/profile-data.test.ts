import { describe, expect, it } from "bun:test";

import {
  buildProfileViewModel,
  clampProficiency,
  getProfileRankLabel,
} from "./profile-data";

describe("profile-data", () => {
  it("builds the study dossier contract from user activity", () => {
    const viewModel = buildProfileViewModel({
      now: new Date("2026-07-11T12:00:00.000Z"),
      user: {
        id: "user-1",
        name: "Treinador Kodan",
        bio: "Leio React como um tabuleiro.",
        image: null,
        elo: 1378,
        createdAt: new Date("2026-01-15T12:00:00.000Z"),
      },
      attempts: [
        {
          id: "attempt-2",
          score: 9,
          eloChange: 14,
          createdAt: new Date("2026-07-11T10:00:00.000Z"),
          challenge: {
            id: "challenge-2",
            title: "Race conditions em fetch",
            difficulty: "HARD",
            recommendedElo: 1500,
            tags: "react,race-condition,fetch",
          },
        },
        {
          id: "attempt-1",
          score: 6,
          eloChange: 5,
          createdAt: new Date("2026-07-10T10:00:00.000Z"),
          challenge: {
            id: "challenge-1",
            title: "Dependências do useEffect",
            difficulty: "MEDIUM",
            recommendedElo: 1300,
            tags: "react,useEffect,hooks",
          },
        },
      ],
      recommendations: [
        {
          id: "recommended-1",
          title: "Validação assíncrona",
          difficulty: "MEDIUM",
          recommendedElo: 1400,
          tags: "forms,validation,async",
        },
      ],
    });

    expect(viewModel.user.name).toBe("Treinador Kodan");
    expect(viewModel.user.rank).toBe("4º Kyu");
    expect(viewModel.user.rankKanji).toBe("四級");
    expect(viewModel.user.elo).toBe(1378);
    expect(viewModel.stats).toHaveLength(5);
    expect(viewModel.stats.find((stat) => stat.id === "resolved")?.value).toBe("2");
    expect(viewModel.stats.find((stat) => stat.id === "streak")?.value).toBe("2 dias");
    expect(viewModel.topicMastery[0]?.label).toBe("Async UI & Races");
    expect(viewModel.topicMastery.some((topic) => topic.locked)).toBe(true);
    expect(viewModel.recentSessions).toHaveLength(2);
    expect(viewModel.recommendations).toHaveLength(1);
    expect(viewModel.recommendations[0]?.topic).toBe("Async UI & Races");
    expect(viewModel.achievements.map((achievement) => achievement.id)).toEqual([
      "first-diagnosis",
      "advanced",
      "effects",
    ]);
  });

  it("keeps proficiency values inside progress bar bounds", () => {
    expect(clampProficiency(-12)).toBe(0);
    expect(clampProficiency(74)).toBe(74);
    expect(clampProficiency(200)).toBe(100);
  });

  it("maps ELO into profile rank labels", () => {
    expect(getProfileRankLabel(900)).toBe("8º Kyu");
    expect(getProfileRankLabel(1687)).toBe("1º Kyu");
    expect(getProfileRankLabel(1900)).toBe("3º Dan");
  });
});
