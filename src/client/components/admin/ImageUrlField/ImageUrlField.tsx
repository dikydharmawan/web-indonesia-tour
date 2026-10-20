"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  ImagePlus,
  Loader2,
  Link2,
  UploadCloud,
} from "lucide-react";
import CoverImage from "@/client/components/ui/CoverImage";

export default function ImageUrlField({
  name,
  label,
  defaultValue,
  bucket,
  hint,
  maxSizeMb,
  aspect = "aspect-[16/9]",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  bucket: "covers" | "panoramas";
  hint?: string;
  maxSizeMb?: number;
  aspect?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const limitMb = maxSizeMb ?? (bucket === "panoramas" ? 20 : 5);

  async function handleUpload(file: File) {
    if (file.size > limitMb * 1024 * 1024) {
      setError(`Ukuran berkas maksimal ${limitMb} MB.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("bucket", bucket);
      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error ?? "Gagal mengunggah gambar.");
      }
      setValue(data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengunggah gambar.",
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={name}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          {label}
        </label>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Link2 className="h-3 w-3" aria-hidden />
          URL atau unggah
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div
          className={`${aspect} w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:w-44`}
        >
          <CoverImage src={value || null} alt={label} />
        </div>

        <div className="flex-1 space-y-2">
          <input
            id={name}
            name={name}
            type="text"
            inputMode="url"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://… atau /api/media/…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <UploadCloud className="h-3.5 w-3.5" aria-hidden />
              )}
              {uploading
                ? "Mengunggah…"
                : "Unggah gambar"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 transition hover:text-rose-600 disabled:opacity-50"
              >
                <ImagePlus className="h-3.5 w-3.5" aria-hidden />
                Kosongkan
              </button>
            )}
          </div>

          {hint && <p className="text-[11px] leading-relaxed text-slate-500">{hint}</p>}
          {error && (
            <p className="inline-flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
