import prisma from "./index";
import { syncChallengesIndexFromContent, upsertChallengesFromContent } from "./challenge-content";

async function run() {
  const syncResult = await syncChallengesIndexFromContent();
  console.log(`[seed:challenges] indexSynced total=${syncResult.total}`);

  const result = await upsertChallengesFromContent(prisma);
  console.log(
    `[seed:challenges] total=${result.total} inserted=${result.inserted} updated=${result.updated}`,
  );
}

run()
  .catch((error) => {
    console.error("[seed:challenges] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
