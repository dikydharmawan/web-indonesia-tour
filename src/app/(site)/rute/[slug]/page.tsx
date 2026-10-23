import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Compass,
  MapPin,
  Orbit,
  Route as RouteIcon,
} from "lucide-react";
import PannellumViewer from "@/client/components/PannellumViewer";
import RouteMap from "@/client/components/route-map/RouteMap";
import CoverImage from "@/client/components/ui/CoverImage";
import Badge from "@/client/components/ui/Badge";
import Breadcrumbs from "@/client/components/ui/Breadcrumbs";
import RouteCard from "@/client/components/routes/RouteCard";
import { getRouteBySlug, listRoutesWithItems } from "@/server/data/routes";
import { getI18n } from "@/server/i18n";
import { interpolate } from "@/shared/i18n-config";
import type { Dictionary } from "@/shared/i18n-dictionaries";
import type { RouteWithItems } from "@/types/db";
import { localizeRoute } from "@/shared/content-i18n";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [routeRaw, { locale, dict }] = await Promise.all([
    getRouteBySlug(slug),
    getI18n(),
  ]);
  if (!routeRaw) return { title: dict.route.metaNotFound };
  const route = localizeRoute(routeRaw, locale);

  return {
    title: route.title,
    description: route.summary ?? undefined,
    openGraph: {
      title: route.title,
      description: route.summary ?? undefined,
      images: route.cover_image ? [route.cover_image] : undefined,
    },
  };
}

function buildTour(route: RouteWithItems, dict: Dictionary) {
  const stops = route.route_items.filter(
    (item) => item.destination?.panorama_url,
  );

  return stops.map((item, index) => {
    const destination = item.destination!;
    const next = stops[index + 1];
    const hotspots: Array<{
      id: string;
      pitch: number;
      yaw: number;
      type: "scene";
      text: string;
      sceneId: string;
    }> = [];

    if (next?.destination?.panorama_url) {
      hotspots.push({
        id: `next-${destination.slug}`,
        pitch: -4,
        yaw: 35,
        type: "scene",
        text: interpolate(dict.route.nextTo, {
          title: next.destination.title,
        }),
        sceneId: next.destination.slug,
      });
    }

    return {
      id: destination.slug,
      panorama: destination.panorama_url!,
      title: `${index + 1}. ${destination.title}`,
      pitch: 0,
      yaw: 0,
      hfov: 100,
      hotspots,
    };
  });
}

export default async function RouteDetailPage({ params }: PageProps) {
  const { locale, dict } = await getI18n();
  const { slug } = await params;
  const routeRaw = await getRouteBySlug(slug);

  if (!routeRaw || routeRaw.status !== "published") notFound();

  const route = localizeRoute(routeRaw, locale);

  const allRoutes = await listRoutesWithItems();
  const otherRoutes = allRoutes
    .filter((item) => item.id !== route.id)
    .slice(0, 2)
    .map((item) => localizeRoute(item, locale));

  const items = route.route_items;
  const tour = buildTour(route, dict);
  const cities = [
    ...new Set(
      items.map((item) => item.destination?.city).filter(Boolean) as string[],
    ),
  ];

  const waypoints = items
    .filter(
      (item) =>
        item.destination?.lat != null && item.destination?.lng != null,
    )
    .map((item) => ({
      id: item.id,
      title: item.destination!.title,
      lat: item.destination!.lat!,
      lng: item.destination!.lng!,
      orderIndex: item.order_index,
      timeSchedule: item.time_schedule,
      notes: item.notes,
      category: item.destination!.category,
      href: `/destinasi/${item.destination!.slug}`,
    }));

  const categories =
    [
      ...new Set(
        items
          .map((item) => item.destination?.category?.toLowerCase())
          .filter(Boolean),
      ),
    ].join(", ") || dict.route.fanOfDefault;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: route.title,
    description: route.summary ?? undefined,
    image: route.cover_image ?? undefined,
    itinerary: items.map((item) => ({
      "@type": "TouristAttraction",
      name: item.destination?.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { href: "/", label: dict.common.home },
              { href: "/rute", label: dict.common.routes },
              { label: route.title },
            ]}
          />
        </div>

        <header className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              <RouteIcon className="h-3.5 w-3.5" aria-hidden />
              {interpolate(dict.common.durationDays, {
                count: route.duration_days,
              })}
            </Badge>
            {cities.slice(0, 3).map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {city}
              </span>
            ))}
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            {route.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
            {route.summary}
          </p>
        </header>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-ink-950 shadow-xl shadow-ink-950/10">
          {tour.length > 0 ? (
            <div>
              <PannellumViewer
                scenes={tour}
                preview={route.cover_image ?? undefined}
                height="clamp(340px, 55vw, 600px)"
                autoRotate={0.5}
                compass
                loadingText={dict.route.tourLoading}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-ink-950 px-5 py-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <Orbit className="h-3.5 w-3.5 text-brand-300" aria-hidden />
                  {interpolate(dict.route.tourFooter, { count: tour.length })}
                </span>
                <span className="text-slate-400">{dict.route.hotspotHint}</span>
              </div>
            </div>
          ) : (
            <div className="relative h-[clamp(300px,46vw,500px)]">
              <CoverImage src={route.cover_image} alt={route.title} />
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/55 p-6 text-center">
                <div className="rounded-2xl bg-ink-950/70 px-6 py-4 text-sm text-white backdrop-blur">
                  <Orbit className="mx-auto mb-2 h-6 w-6 text-brand-300" aria-hidden />
                  {dict.route.noPanorama}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.45fr_1fr] lg:px-8">
        <article>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {dict.route.itinerary}
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            {dict.route.itineraryDesc}
          </p>

          <ol className="mt-6 space-y-4">
            {items.map((item, index) => {
              const destination = item.destination;
              const isLast = index === items.length - 1;
              return (
                <li key={item.id} className="relative flex gap-4">
                  {!isLast && (
                    <span
                      className="absolute start-[19px] top-11 h-[calc(100%-1rem)] w-px bg-slate-200"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-semibold text-white ring-4 ring-brand-50">
                    {index + 1}
                  </span>
                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        {item.time_schedule && (
                          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            {item.time_schedule}
                          </p>
                        )}
                        {destination ? (
                          <Link
                            href={`/destinasi/${destination.slug}`}
                            className="mt-1 block font-display text-lg font-semibold text-ink-900 hover:text-brand-800"
                          >
                            {destination.title}
                          </Link>
                        ) : (
                          <p className="mt-1 font-display text-lg font-semibold text-ink-900">
                            {dict.route.destinationUnavailable}
                          </p>
                        )}
                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          {destination?.city ?? "—"}
                          {destination?.category ? ` · ${destination.category}` : ""}
                        </p>
                      </div>
                      {destination?.cover_image && (
                        <CoverImage
                          src={destination.cover_image}
                          alt={destination.title}
                          className="hidden h-16 w-24 shrink-0 rounded-xl sm:block"
                        />
                      )}
                    </div>
                    {item.notes && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">
                        {item.notes}
                      </p>
                    )}
                    <Link
                      href={`/destinasi/${destination?.slug ?? ""}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
                    >
                      {dict.route.viewDestination}
                      <ArrowRight className="h-3 w-3 rtl:rotate-180" aria-hidden />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900">
            <p className="font-semibold">{dict.route.travelNoteTitle}</p>
            <p className="mt-1 text-amber-800">{dict.route.travelNoteBody}</p>
          </div>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-ink-900">
                {dict.route.mapTitle}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {interpolate(dict.route.points, { count: waypoints.length })}
              </span>
            </div>
            <div className="mt-4">
              <RouteMap waypoints={waypoints} height="340px" showPolyline />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {dict.route.duration}
                </p>
                <p className="mt-1 font-semibold text-ink-900">
                  {interpolate(dict.common.durationDays, {
                    count: route.duration_days,
                  })}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Compass className="h-3.5 w-3.5" aria-hidden />
                  {dict.route.destinations}
                </p>
                <p className="mt-1 font-semibold text-ink-900">
                  {interpolate(dict.route.places, { count: items.length })}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-brand-50/70 p-5">
            <p className="font-semibold text-brand-900">
              {dict.route.suitableFor}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-brand-800/90">
              <li>
                •{" "}
                {interpolate(dict.route.firstTime, {
                  city: cities[0] ?? dict.common.indonesia,
                })}
              </li>
              <li>
                •{" "}
                {interpolate(dict.route.fanOf, { category: categories })}
              </li>
              <li>• {dict.route.family}</li>
            </ul>
          </div>

          <Link
            href="/rute"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
            {dict.route.allRoutes}
          </Link>
        </aside>
      </div>

      {otherRoutes.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-3xl font-semibold text-ink-900">
                {dict.route.otherRoutes}
              </h2>
              <Link
                href="/rute"
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                {dict.route.viewAllRoutes}
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {otherRoutes.map((item) => (
                <RouteCard key={item.id} route={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
