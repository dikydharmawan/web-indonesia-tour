import { getNumber, getOptional, getString } from "./form";
import { slugify } from "@/shared/utils";

export type RoutePayload = {
  title: string;
  slug: string;
  summary: string | null;
  duration_days: number;
  cover_image: string | null;
  status: "published" | "draft";
};

export type RouteItemInput = {
  destination_id: string;
  order_index: number;
  time_schedule: string | null;
  notes: string | null;
};

export function parseRouteForm(formData: FormData): RoutePayload {
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const durationRaw = getNumber(formData, "duration_days");

  return {
    title,
    slug,
    summary: getOptional(formData, "summary"),
    duration_days: Math.min(60, Math.max(1, durationRaw ?? 1)),
    cover_image: getOptional(formData, "cover_image"),
    status: getString(formData, "status") === "published" ? "published" : "draft",
  };
}

export function parseRouteItems(formData: FormData): RouteItemInput[] {
  const raw = getString(formData, "items");
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Format daftar destinasi rute tidak valid.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Daftar destinasi rute tidak valid.");
  }

  return parsed
    .slice(0, 100)
    .map((entry, index) => {
      const item = entry as Record<string, unknown>;
      const destinationId =
        typeof item.destination_id === "string" ? item.destination_id.trim() : "";
      if (!destinationId) return null;
      return {
        destination_id: destinationId,
        order_index: index,
        time_schedule:
          typeof item.time_schedule === "string" && item.time_schedule.trim()
            ? item.time_schedule.trim()
            : null,
        notes:
          typeof item.notes === "string" && item.notes.trim()
            ? item.notes.trim()
            : null,
      };
    })
    .filter((item): item is RouteItemInput => item !== null);
}
