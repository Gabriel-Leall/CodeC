import {
  jsonFailure,
  jsonSuccess,
  parseSearchParams,
} from "@/server/api/http";
import { serializeChallengeSummary } from "@/server/api/serializers";
import { listChallenges } from "@/server/api/service";
import { listChallengesQuerySchema } from "@/server/api/schemas";

export async function GET(request: Request) {
  const parsed = parseSearchParams(request, listChallengesQuerySchema);

  if (!parsed.success) {
    return jsonFailure(parsed.error, 400);
  }

  const result = await listChallenges(parsed.data);

  if (!result.success || !result.data) {
    return jsonFailure(result.error ?? "Erro ao buscar desafios", 500);
  }

  return jsonSuccess({
    ...result.data,
    items: result.data.items.map(serializeChallengeSummary),
  });
}
