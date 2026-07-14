import { isMockMode } from "@/lib/mock-mode";
import { getAuthRouteHandlers } from "@/lib/auth-route-handlers";

function mockModeResponse() {
  return Response.json(
    {
      success: false,
      error: "Autenticação não está disponível com USE_MOCK_DATA=true.",
    },
    { status: 404 },
  );
}

export async function GET(request: Request) {
  if (isMockMode()) return mockModeResponse();
  return (await getAuthRouteHandlers()).GET(request);
}

export async function POST(request: Request) {
  if (isMockMode()) return mockModeResponse();
  return (await getAuthRouteHandlers()).POST(request);
}
