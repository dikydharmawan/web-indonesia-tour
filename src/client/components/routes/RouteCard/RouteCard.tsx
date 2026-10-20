import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import CoverImage from "@/client/components/ui/CoverImage";
import Badge from "@/client/components/ui/Badge";
import { getI18n } from "@/server/i18n";
import { interpolate } from "@/shared/i18n-config";
import { truncate } from "@/shared/utils";
import type { RouteWithItems } from "@/types/db";

export default async function RouteCard({
  route,
  showStatus = false,
}: {
  route: RouteWithItems;
  showStatus?: boolean;
}) {
  const { dict } = await getI18n();
  const items = route.route_items ?? [];
  const cities = [
    ...new Set(items.map((item) => item.destination?.city).filter(Boolean)),
  ];

  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10">
      <Link
        href={`/rute/${route.slug}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <CoverImage
            src={route.cover_image}
            alt={route.title}
            className="transition duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-3 top-3 flex items-center gap-2">
            <Badge variant="outline">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {interpolate(dict.common.durationDays, {
                count: route.duration_days,
              })}
            </Badge>
            {showStatus && (
              <Badge variant={route.status === "published" ? "brand" : "amber"}>
                {route.status === "published" ? "Terbit" : "Draf"}
              </Badge>
            )}
          </div>
          <div className="absolute inset-x-4 bottom-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white/90">
            {cities.slice(0, 3).map((city) => (
              <span key={city} className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900 transition group-hover:text-brand-800">
            {route.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
            {truncate(route.summary, 150)}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>
              {interpolate(dict.common.destinationCount, {
                count: items.length,
              })}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
              {dict.common.viewRoute}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
