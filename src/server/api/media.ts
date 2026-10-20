import { NextResponse } from "next/server";
import { getMediaById } from "@/server/data/media";

export async function handleMediaRequest(
  _request: Request,
  params: Promise<{ id: string }>,
): Promise<Response> {
  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const media = await getMediaById(id);
  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.content_type,
      "Content-Length": String(media.byte_size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
