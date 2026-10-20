import "server-only";

import { query } from "@/server/db";
import type {
  Destination,
  DestinationFilters,
  FilterOption,
} from "@/types/db";

export function sortDestinations(list: Destination[]): Destination[] {
  return [...list].sort((a, b) => a.title.localeCompare(b.title, "id"));
}

export async function listDestinations(
  filters: DestinationFilters = {},
): Promise<Destination[]> {
  const q = filters.q?.trim();
  const category = filters.category?.trim();
  const city = filters.city?.trim();

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (q) {
    params.push(`%${q}%`);
    const i = params.length;
    conditions.push(
      `(title ilike $${i} or description ilike $${i} or city ilike $${i} or category ilike $${i})`,
    );
  }
  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (city) {
    params.push(city);
    conditions.push(`city = $${params.length}`);
  }

  const where = conditions.length ? `where ${conditions.join(" and ")}` : "";
  const result = await query<Destination>(
    `select * from public.destinations ${where} order by title asc`,
    params,
  );
  return result.rows;
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | null> {
  const result = await query<Destination>(
    "select * from public.destinations where slug = $1 limit 1",
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function getDestinationById(
  id: string,
): Promise<Destination | null> {
  const result = await query<Destination>(
    "select * from public.destinations where id = $1 limit 1",
    [id],
  );
  return result.rows[0] ?? null;
}

export async function getAllDestinations(): Promise<Destination[]> {
  return listDestinations();
}

export async function getFilterOptions(): Promise<{
  categories: FilterOption[];
  cities: FilterOption[];
}> {
  const destinations = await listDestinations();
  const aggregate = (key: "category" | "city"): FilterOption[] => {
    const map = new Map<string, number>();
    for (const destination of destinations) {
      const value = destination[key];
      if (value) map.set(value, (map.get(value) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value, "id"));
  };

  return { categories: aggregate("category"), cities: aggregate("city") };
}

export async function getFeaturedDestinations(
  limit = 4,
): Promise<Destination[]> {
  const destinations = await listDestinations();
  const withPanorama = destinations.filter((item) => item.panorama_url);
  const rest = destinations.filter((item) => !item.panorama_url);
  return [...withPanorama, ...rest].slice(0, limit);
}

export async function getRelatedDestinations(
  destination: Destination,
  limit = 3,
): Promise<Destination[]> {
  const destinations = await listDestinations();
  const scored = destinations
    .filter((item) => item.id !== destination.id)
    .map((item) => {
      let score = 0;
      if (item.category && item.category === destination.category) score += 2;
      if (item.city && item.city === destination.city) score += 1;
      return { item, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score || a.item.title.localeCompare(b.item.title, "id"),
    );
  return scored.slice(0, limit).map((entry) => entry.item);
}

export type SiteStats = {
  destinations: number;
  routes: number;
  cities: number;
  panoramas: number;
};

export async function getSiteStats(): Promise<SiteStats> {
  const [destinations, routeCount] = await Promise.all([
    listDestinations(),
    query<{ count: number }>(
      "select count(*)::int as count from public.routes where status = 'published'",
    ).then((result) => result.rows[0]?.count ?? 0),
  ]);

  return {
    destinations: destinations.length,
    routes: routeCount,
    cities: new Set(destinations.map((item) => item.city).filter(Boolean)).size,
    panoramas: destinations.filter((item) => item.panorama_url).length,
  };
}
