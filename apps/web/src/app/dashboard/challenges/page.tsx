import { getChallenges } from "../actions";
import ChallengesPageClient from "./challenges-page-client";
import { CHALLENGES_INITIAL_LOAD_SIZE, DEFAULT_USER_ELO } from "./constants";
import { type Challenge } from "./ema-challenge-card-helpers";
import type { StatusFilter } from "./challenges-list-state";

export default async function ChallengesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const initialStatus: StatusFilter = status === "in_progress" || status === "resolved" || status === "not_started" ? status : "ALL";
  const response = await getChallenges({
    limit: CHALLENGES_INITIAL_LOAD_SIZE,
    offset: 0,
  });

  return (
    <ChallengesPageClient
      initialData={
        response.success && response.data
          ? {
              challenges: response.data.items as Challenge[],
              hasMore: response.data.hasMore,
              totalCount: response.data.total,
              userElo: response.data.userElo,
              initialError: null,
              initialStatus,
            }
          : {
              challenges: [],
              hasMore: false,
              totalCount: 0,
              userElo: DEFAULT_USER_ELO,
              initialError: response.error || "Não foi possível carregar os desafios agora.",
              initialStatus,
            }
      }
    />
  );
}
