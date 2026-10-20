import "server-only";

import { query } from "@/server/db";
import type { Destination, Route, RouteItem, RouteWithItems } from "@/types/db";

export function sortRouteItems(items: RouteItem[]): RouteItem[] {
  return [...items].sort(
    (a, b) =>
      a.order_index - b.order_index ||
      (a.time_schedule ?? "").localeCompare(b.time_schedule ?? "", "id"),
  );
}

export function sortRoutes(list: Route[]): Route[] {
  return [...list].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

type RouteRow = Route & {
  items: (RouteItem & { destination: Destination | null })[] | null;
};

function fetchRoutesWithItems(
  whereClause: string,
  params: unknown[] = [],
): Promise<RouteWithItems[]> {
  const sql = `
    select r.*,
      coalesce(
        json_agg(
          json_build_object(
            'id', ri.id,
            'route_id', ri.route_id,
            'destination_id', ri.destination_id,
            'order_index', ri.order_index,
            'time_schedule', ri.time_schedule,
            'notes', ri.notes,
            'created_at', ri.created_at,
            'destination', to_jsonb(d.*)
          )
          order by ri.order_index
        ) filter (where ri.id is not null),
        '[]'::json
      ) as items
    from public.routes r
    left join public.route_items ri on ri.route_id = r.id
    left join public.destinations d on d.id = ri.destination_id
    ${whereClause}
    group by r.id
    order by r.created_at desc
  `;
  return query<RouteRow>(sql, params).then((result) =>
    result.rows.map(({ items, ...route }) => ({
      ...route,
      route_items: sortRouteItems(items ?? []),
    })),
  );
}

export async function listRoutes(
  options: { includeDrafts?: boolean } = {},
): Promise<Route[]> {
  const where = options.includeDrafts ? "" : "where status = 'published'";
  const result = await query<Route>(
    `select * from public.routes ${where} order by created_at desc`,
  );
  return result.rows;
}

export async function listRoutesWithItems(
  options: { includeDrafts?: boolean } = {},
): Promise<RouteWithItems[]> {
  const where = options.includeDrafts ? "" : "where r.status = 'published'";
  return fetchRoutesWithItems(where);
}

export async function getRouteBySlug(
  slug: string,
): Promise<RouteWithItems | null> {
  const routes = await fetchRoutesWithItems("where r.slug = $1", [slug]);
  return routes[0] ?? null;
}

export async function getRouteById(
  id: string,
): Promise<RouteWithItems | null> {
  const routes = await fetchRoutesWithItems("where r.id = $1", [id]);
  return routes[0] ?? null;
}

export async function getRoutesForDestination(
  destinationId: string,
): Promise<RouteWithItems[]> {
  const routes = await listRoutesWithItems();
  return routes.filter((route) =>
    route.route_items.some((item) => item.destination_id === destinationId),
  );
}

export async function getRouteStats() {
  const routes = await listRoutes({ includeDrafts: true });
  return {
    total: routes.length,
    published: routes.filter((route) => route.status === "published").length,
    draft: routes.filter((route) => route.status === "draft").length,
  };
}
