import { syncChallengesIndexFromContent } from "@kodan/content/promoted-challenge-catalog";

async function run() {
  const result = await syncChallengesIndexFromContent();
  console.log(`[sync:challenges:index] total=${result.total} path=${result.indexPath}`);
}

run().catch((error) => {
  console.error("[sync:challenges:index] failed", error);
  process.exitCode = 1;
});
