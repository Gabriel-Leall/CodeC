import { jsonFailure, jsonSuccess } from "@/server/api/http";
import { serializeAttempt } from "@/server/api/serializers";
import { listCurrentUserAttempts } from "@/server/api/service";

export async function GET() {
  const result = await listCurrentUserAttempts();

  if (!result.success || !result.data) {
    return jsonFailure(result.error ?? "Erro ao buscar histórico de tentativas", 500);
  }

  return jsonSuccess(result.data.map(serializeAttempt));
}
