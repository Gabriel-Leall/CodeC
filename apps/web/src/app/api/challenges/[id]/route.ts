import { jsonFailure, jsonSuccess } from "@/server/api/http";
import { serializeChallengeDetail } from "@/server/api/serializers";
import { getChallengeById } from "@/server/api/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return jsonFailure("ID do desafio é obrigatório", 400);
  }

  const result = await getChallengeById(id);

  if (!result.success || !result.data) {
    const error = result.error ?? "Erro ao buscar desafio";
    const status = error === "Desafio não encontrado" ? 404 : 500;
    return jsonFailure(error, status);
  }

  return jsonSuccess(serializeChallengeDetail(result.data));
}
