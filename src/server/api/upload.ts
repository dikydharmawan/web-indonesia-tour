import { NextResponse } from "next/server";
import {
  insertMedia,
  isAllowedType,
  isMediaBucket,
  maxSizeFor,
} from "@/server/data/media";

export async function handleUpload(request: Request): Promise<Response> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Berkas tidak dapat dibaca." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Pilih berkas gambar terlebih dahulu." },
      { status: 400 },
    );
  }
  if (!isMediaBucket(bucket)) {
    return NextResponse.json(
      { error: "Jenis unggahan tidak dikenal." },
      { status: 400 },
    );
  }
  if (!isAllowedType(file.type)) {
    return NextResponse.json(
      { error: "Format harus JPG, PNG, atau WebP." },
      { status: 415 },
    );
  }
  if (file.size > maxSizeFor(bucket)) {
    return NextResponse.json(
      { error: `Ukuran berkas maksimal ${maxSizeFor(bucket) / (1024 * 1024)} MB.` },
      { status: 413 },
    );
  }

  try {
    const url = await insertMedia({
      bucket,
      filename: file.name || "upload",
      contentType: file.type,
      data: Buffer.from(await file.arrayBuffer()),
    });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan berkas." },
      { status: 500 },
    );
  }
}
