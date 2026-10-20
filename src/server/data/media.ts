import "server-only";

import { queryOne } from "@/server/db";

export type MediaBucket = "covers" | "panoramas";

export type MediaRecord = {
  id: string;
  bucket: MediaBucket;
  filename: string;
  content_type: string;
  byte_size: number;
  data: Buffer;
};

const MAX_SIZE_BY_BUCKET: Record<MediaBucket, number> = {
  covers: 5 * 1024 * 1024,
  panoramas: 20 * 1024 * 1024,
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function isMediaBucket(value: string): value is MediaBucket {
  return value === "covers" || value === "panoramas";
}

export function isAllowedType(value: string): boolean {
  return ALLOWED_TYPES.has(value);
}

export function maxSizeFor(bucket: MediaBucket): number {
  return MAX_SIZE_BY_BUCKET[bucket];
}

export async function insertMedia(input: {
  bucket: MediaBucket;
  filename: string;
  contentType: string;
  data: Buffer;
}): Promise<string> {
  const row = await queryOne<{ id: string }>(
    `insert into public.media (bucket, filename, content_type, byte_size, data)
     values ($1, $2, $3, $4, $5)
     returning id`,
    [
      input.bucket,
      input.filename,
      input.contentType,
      input.data.length,
      input.data,
    ],
  );
  if (!row) throw new Error("Gagal menyimpan gambar.");
  return `/api/media/${row.id}`;
}

export async function getMediaById(id: string): Promise<MediaRecord | null> {
  return queryOne<MediaRecord>(
    `select id, bucket, filename, content_type, byte_size, data
       from public.media where id = $1 limit 1`,
    [id],
  );
}
