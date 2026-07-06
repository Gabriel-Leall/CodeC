import { getChallenges } from "../actions";
import ChallengesPageClient from "./challenges-page-client";
import { CHALLENGES_PAGE_SIZE, DEFAULT_USER_ELO } from "./constants";
import { type Challenge } from "./ema-challenge-card-helpers";

export default async function ChallengesPage() {
  const response = await getChallenges({ limit: CHALLENGES_PAGE_SIZE, offset: 0 });

  return (
    <ChallengesPageClient
      initialData={
        response.success && response.data
          ? {
              challenges: response.data.items as Challenge[],
              hasMore: response.data.hasMore,
              userElo: response.data.userElo,
              initialError: null,
            }
          : {
              challenges: [],
              hasMore: false,
              userElo: DEFAULT_USER_ELO,
              initialError: response.error || "Não foi possível carregar os desafios agora.",
            }
      }
    />
  );
}
