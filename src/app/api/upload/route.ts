import { handleUpload } from "@/server/api/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleUpload(request);
}
