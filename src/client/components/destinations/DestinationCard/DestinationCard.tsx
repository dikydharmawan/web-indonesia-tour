import Link from "next/link";
import { ArrowUpRight, MapPin, MoveUpRight, Orbit } from "lucide-react";
import CoverImage from "@/client/components/ui/CoverImage";
import Badge from "@/client/components/ui/Badge";
import { type Dictionary } from "@/shared/i18n-dictionaries";
import { interpolate } from "@/shared/i18n-config";
import { truncate } from "@/shared/utils";
import type { Destination } from "@/types/db";

export default function DestinationCard({
  destination,
  dict,
  priority = false,
}: {
  destination: Destination;
  dict: Dictionary;
  priority?: boolean;
}) {

  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10">
      <Link
        href={`/destinasi/${destination.slug}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <CoverImage
            src={destination.cover_image}
            alt={destination.title}
            eager={priority}
            className="transition duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/5 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            {destination.category && (
              <Badge variant="dark" className="bg-ink-950/60 backdrop-blur">
                {destination.category}
              </Badge>
            )}
            {destination.panorama_url && (
              <Badge variant="outline">
                <Orbit className="h-3.5 w-3.5" aria-hidden />
                360°
              </Badge>
            )}
          </div>
          <div className="absolute inset-x-4 bottom-3 flex items-center gap-1.5 text-xs font-medium text-white/90">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {destination.city ?? dict.common.indonesia}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900 transition group-hover:text-brand-800">
              {destination.title}
            </h3>
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700">
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
            {truncate(destination.description, 100)}
          </p>
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
            {destination.facilities.slice(0, 2).map((facility) => (
              <span key={facility} className="inline-flex items-center gap-1">
                <MoveUpRight className="h-3 w-3 text-brand-600" aria-hidden />
                {facility}
              </span>
            ))}
            {destination.facilities.length > 2 && (
              <span>
                {interpolate(dict.common.moreCount, {
                  count: destination.facilities.length - 2,
                })}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
