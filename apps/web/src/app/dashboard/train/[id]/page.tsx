import { getChallenge } from "../../actions";
import TrainArenaClient, { type Challenge } from "./train-arena-client";

export default async function TrainArenaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challengeRes = await getChallenge(id);

  const initialChallenge: Challenge | null =
    challengeRes.success && challengeRes.data
      ? (challengeRes.data as Challenge)
      : null;

  return (
    <TrainArenaClient
      id={id}
      initialChallenge={initialChallenge}
    />
  );
}
