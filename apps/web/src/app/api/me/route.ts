import { jsonFailure, jsonSuccess, parseJsonBody } from "@/server/api/http";
import { serializeUser } from "@/server/api/serializers";
import {
  getCurrentUser,
  updateCurrentUserProfile,
} from "@/server/api/service";
import { updateCurrentUserSchema } from "@/server/api/schemas";

export async function GET() {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    return jsonFailure(result.error ?? "Erro ao obter usuário local", 500);
  }

  return jsonSuccess(serializeUser(result.data));
}

export async function PATCH(request: Request) {
  const parsed = await parseJsonBody(request, updateCurrentUserSchema);

  if (!parsed.success) {
    return jsonFailure(parsed.error, 400);
  }

  const result = await updateCurrentUserProfile(parsed.data);

  if (!result.success || !result.data) {
    return jsonFailure(result.error ?? "Erro ao atualizar perfil", 400);
  }

  return jsonSuccess(serializeUser(result.data));
}
