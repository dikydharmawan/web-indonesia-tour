import "server-only";

import type { Destination, Route, RouteStatus } from "@/types/db";
import { query } from "@/server/db";

export type DestinationInput = Omit<
  Destination,
  "id" | "created_at" | "updated_at"
>;

export type RouteInput = Omit<Route, "id" | "created_at" | "updated_at">;

export type RouteItemInput = {
  destination_id: string;
  order_index: number;
  time_schedule: string | null;
  notes: string | null;
};

export async function insertDestination(input: DestinationInput): Promise<string> {
  const row = await query<{ id: string }>(
    `insert into public.destinations
       (title, slug, description, category, city, kecamatan, cover_image, panorama_url,
        lat, lng, ticket_info, opening_hours, facilities)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb,$13)
     returning id`,
    [
      input.title,
      input.slug,
      input.description,
      input.category,
      input.city,
      input.kecamatan,
      input.cover_image,
      input.panorama_url,
      input.lat,
      input.lng,
      input.ticket_info ? JSON.stringify(input.ticket_info) : null,
      input.opening_hours ? JSON.stringify(input.opening_hours) : null,
      input.facilities,
    ],
  );
  return row.rows[0].id;
}

export async function updateDestinationRow(
  id: string,
  input: DestinationInput,
): Promise<void> {
  await query(
    `update public.destinations set
       title=$2, slug=$3, description=$4, category=$5, city=$6, kecamatan=$7,
       cover_image=$8, panorama_url=$9, lat=$10, lng=$11,
       ticket_info=$12::jsonb, opening_hours=$13::jsonb, facilities=$14,
       updated_at=now()
     where id=$1`,
    [
      id,
      input.title,
      input.slug,
      input.description,
      input.category,
      input.city,
      input.kecamatan,
      input.cover_image,
      input.panorama_url,
      input.lat,
      input.lng,
      input.ticket_info ? JSON.stringify(input.ticket_info) : null,
      input.opening_hours ? JSON.stringify(input.opening_hours) : null,
      input.facilities,
    ],
  );
}

export async function deleteDestinationRow(id: string): Promise<void> {
  const result = await query("delete from public.destinations where id=$1", [id]);
  if (result.rowCount === 0) throw new Error("Destinasi tidak ditemukan.");
}

export async function insertRoute(
  input: RouteInput,
  items: RouteItemInput[],
): Promise<string> {
  const row = await query<{ id: string }>(
    `insert into public.routes
       (title, slug, summary, duration_days, cover_image, status)
     values ($1,$2,$3,$4,$5,$6)
     returning id`,
    [
      input.title,
      input.slug,
      input.summary,
      input.duration_days,
      input.cover_image,
      input.status,
    ],
  );
  const routeId = row.rows[0].id;
  await insertRouteItems(routeId, items);
  return routeId;
}

export async function updateRouteRow(
  id: string,
  input: RouteInput,
  items: RouteItemInput[],
): Promise<void> {
  const result = await query(
    `update public.routes set
       title=$2, slug=$3, summary=$4, duration_days=$5, cover_image=$6,
       status=$7, updated_at=now()
     where id=$1`,
    [
      id,
      input.title,
      input.slug,
      input.summary,
      input.duration_days,
      input.cover_image,
      input.status,
    ],
  );
  if (result.rowCount === 0) throw new Error("Rute tidak ditemukan.");
  await query("delete from public.route_items where route_id=$1", [id]);
  await insertRouteItems(id, items);
}

export async function deleteRouteRow(id: string): Promise<void> {
  const result = await query("delete from public.routes where id=$1", [id]);
  if (result.rowCount === 0) throw new Error("Rute tidak ditemukan.");
}

export async function setRouteStatus(
  id: string,
  status: RouteStatus,
): Promise<void> {
  const result = await query(
    "update public.routes set status=$2, updated_at=now() where id=$1",
    [id, status],
  );
  if (result.rowCount === 0) throw new Error("Rute tidak ditemukan.");
}

async function insertRouteItems(routeId: string, items: RouteItemInput[]) {
  for (const [index, item] of items.entries()) {
    await query(
      `insert into public.route_items
         (route_id, destination_id, order_index, time_schedule, notes)
       values ($1,$2,$3,$4,$5)`,
      [
        routeId,
        item.destination_id,
        index,
        item.time_schedule,
        item.notes,
      ],
    );
  }
}
