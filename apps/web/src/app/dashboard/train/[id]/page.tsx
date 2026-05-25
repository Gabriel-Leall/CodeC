import { getChallenge, getLocalUser } from "../../actions";
import TrainArenaClient, { type Challenge } from "./train-arena-client";

export default async function TrainArenaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [challengeRes, userRes] = await Promise.all([
    getChallenge(id),
    getLocalUser(),
  ]);

  const initialChallenge: Challenge | null =
    challengeRes.success && challengeRes.data
      ? (challengeRes.data as Challenge)
      : null;

  const initialUserElo =
    userRes.success && userRes.data ? userRes.data.elo : 1200;

  return (
    <TrainArenaClient
      id={id}
      initialChallenge={initialChallenge}
      initialUserElo={initialUserElo}
    />
  );
}
