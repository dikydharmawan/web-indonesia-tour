import { handleMediaRequest } from "@/server/api/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  return handleMediaRequest(request, params);
}
