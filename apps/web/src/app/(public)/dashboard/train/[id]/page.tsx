import { headers } from "next/headers";

import { isMockMode } from "@/lib/mock-mode";
import { getRuntimeSession } from "@/lib/runtime-data";
import { serializeChallengeDetail } from "@/server/api/serializers";
import { getChallengeById } from "@/server/api/service";
import TrainArenaClient, { type Challenge } from "./train-arena-client";

export default async function TrainArenaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [challengeRes, session] = await Promise.all([
    getChallengeById(id),
    isMockMode() ? Promise.resolve(null) : getRuntimeSession(await headers()),
  ]);

  const initialChallenge: Challenge | null =
    challengeRes.success && challengeRes.data
      ? (serializeChallengeDetail(challengeRes.data) as Challenge)
      : null;

  return (
    <TrainArenaClient
      id={id}
      initialChallenge={initialChallenge}
      isAuthenticated={isMockMode() || Boolean(session?.user)}
    />
  );
}
