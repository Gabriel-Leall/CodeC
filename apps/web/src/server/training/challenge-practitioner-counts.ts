type PractitionerPair = {
  challengeId: string;
  userId: string;
};

type PractitionerPairReader = {
  findMany(query: {
    where: { challengeId: { in: string[] } };
    select: { challengeId: true; userId: true };
    distinct: ["challengeId", "userId"];
  }): Promise<PractitionerPair[]>;
};

export async function loadPractitionerCountsForChallenges(
  attempts: PractitionerPairReader,
  challengeIds: string[],
) {
  if (challengeIds.length === 0) {
    return new Map<string, number>();
  }

  const practitionerPairs = await attempts.findMany({
    where: { challengeId: { in: challengeIds } },
    select: { challengeId: true, userId: true },
    distinct: ["challengeId", "userId"],
  });

  return practitionerPairs.reduce(
    (counts, pair) => {
      counts.set(pair.challengeId, (counts.get(pair.challengeId) ?? 0) + 1);
      return counts;
    },
    new Map<string, number>(),
  );
}
