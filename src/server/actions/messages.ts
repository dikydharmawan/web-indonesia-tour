import { isSafePath } from "./form";

/**
 * Membangun URL redirect beserta pesan singkat di query string.
 */
export function flashUrl(
  path: string,
  key: "error" | "saved",
  message: string,
): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(message)}`;
}

export function errorMessage(error: unknown): string {
  const message =
    error instanceof Error ? error.message : "Terjadi kesalahan tak terduga.";
  if (message.includes("duplicate key") && message.includes("slug")) {
    return "Slug sudah dipakai. Pilih slug lain.";
  }
  if (message.includes("violates check constraint")) {
    return "Data tidak valid. Periksa kembali isian formulir.";
  }
  return message;
}

/** Hanya izinkan redirect ke path internal. */
export function safeRedirectTarget(value: string, fallback = "/admin"): string {
  return isSafePath(value) ? value : fallback;
}
