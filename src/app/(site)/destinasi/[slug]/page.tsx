import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Car,
  Check,
  Clock,
  Compass,
  ExternalLink,
  MapPin,
  Navigation,
  Orbit,
  Ticket,
} from "lucide-react";
import PannellumViewer from "@/client/components/PannellumViewer";
import RouteMap from "@/client/components/route-map/RouteMap";
import CoverImage from "@/client/components/ui/CoverImage";
import Badge from "@/client/components/ui/Badge";
import Breadcrumbs from "@/client/components/ui/Breadcrumbs";
import DestinationCard from "@/client/components/destinations/DestinationCard";
import RouteCard from "@/client/components/routes/RouteCard";
import {
  getDestinationBySlug,
  getRelatedDestinations,
} from "@/server/data/destinations";
import { getRoutesForDestination } from "@/server/data/routes";
import { getI18n } from "@/server/i18n";
import { interpolate } from "@/shared/i18n-config";
import { formatRupiah } from "@/shared/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [destination, { dict }] = await Promise.all([
    getDestinationBySlug(slug),
    getI18n(),
  ]);
  if (!destination) return { title: dict.destination.metaNotFound };

  return {
    title: destination.title,
    description:
      destination.description?.slice(0, 155) ??
      interpolate(dict.destination.metaDesc, { title: destination.title }),
    openGraph: {
      title: destination.title,
      description: destination.description ?? undefined,
      images: destination.cover_image ? [destination.cover_image] : undefined,
    },
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { dict } = await getI18n();
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) notFound();

  const [related, routes] = await Promise.all([
    getRelatedDestinations(destination, 3),
    getRoutesForDestination(destination.id),
  ]);

  const ticket = destination.ticket_info;
  const hours = destination.opening_hours;
  const ticketRows = [
    ticket?.adult != null
      ? { label: dict.destination.adult, value: formatRupiah(ticket.adult) }
      : null,
    ticket?.child != null
      ? { label: dict.destination.child, value: formatRupiah(ticket.child) }
      : null,
    ticket?.vehicle != null
      ? {
          label: dict.destination.vehicle,
          value: formatRupiah(ticket.vehicle),
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const mapsQuery =
    destination.lat != null && destination.lng != null
      ? `${destination.lat},${destination.lng}`
      : `${destination.title} ${destination.city ?? ""}`.trim();

  const paragraphs = (destination.description ?? "").split(/\n{2,}/);
  const waypoint = {
    id: destination.id,
    title: destination.title,
    lat: destination.lat ?? -2.5489,
    lng: destination.lng ?? 118.0149,
    category: destination.category,
    notes: destination.city,
    orderIndex: 0,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.title,
    description: destination.description ?? undefined,
    image: destination.cover_image ?? undefined,
    address: destination.city
      ? {
          "@type": "PostalAddress",
          addressLocality: destination.city,
          addressCountry: "ID",
        }
      : undefined,
    geo:
      destination.lat != null && destination.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: destination.lat,
            longitude: destination.lng,
          }
        : undefined,
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
              { href: "/destinasi", label: dict.common.destinations },
              { label: destination.title },
            ]}
          />
        </div>

        <header className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {destination.category && (
              <Badge variant="brand">{destination.category}</Badge>
            )}
            {destination.panorama_url && (
              <Badge variant="amber">
                <Orbit className="h-3.5 w-3.5" aria-hidden />
                360°
              </Badge>
            )}
            {destination.city && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {destination.city}
              </span>
            )}
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            {destination.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
            {destination.description?.split(/\n{2,}/)[0] ?? ""}
          </p>
        </header>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-ink-950 shadow-xl shadow-ink-950/10">
          {destination.panorama_url ? (
            <PannellumViewer
              src={destination.panorama_url}
              preview={destination.cover_image ?? undefined}
              height="clamp(340px, 55vw, 600px)"
              autoRotate={0.6}
              compass
              hfov={100}
              loadingText={interpolate(dict.destination.panoramaLoading, {
                title: destination.title,
              })}
            />
          ) : (
            <div className="relative h-[clamp(300px,48vw,520px)]">
              <CoverImage
                src={destination.cover_image}
                alt={destination.title}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/50 p-6 text-center">
                <div className="rounded-2xl bg-ink-950/70 px-6 py-4 text-sm text-white backdrop-blur">
                  <Orbit className="mx-auto mb-2 h-6 w-6 text-brand-300" aria-hidden />
                  {dict.destination.panoramaUnavailable}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="space-y-10">
          <section aria-labelledby="tentang-destinasi">
            <h2
              id="tentang-destinasi"
              className="font-display text-2xl font-semibold text-ink-900"
            >
              {dict.destination.about}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-700 sm:text-base">
              {(paragraphs.length
                ? paragraphs
                : [dict.destination.descUnavailable]
              ).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="lokasi-destinasi">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2
                id="lokasi-destinasi"
                className="font-display text-2xl font-semibold text-ink-900"
              >
                {dict.destination.location}
              </h2>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
              >
                <Navigation className="h-3.5 w-3.5" aria-hidden />
                {dict.destination.directions}
              </a>
            </div>
            <div className="mt-4">
              <RouteMap
                waypoints={[waypoint]}
                height="360px"
                showPolyline={false}
                fitBoundsPadding={80}
              />
            </div>
            {destination.lat != null && destination.lng != null && (
              <p className="mt-2 text-xs text-slate-500">
                {interpolate(dict.destination.coordinates, {
                  lat: destination.lat.toFixed(5),
                  lng: destination.lng.toFixed(5),
                })}
              </p>
            )}
          </section>

          {routes.length > 0 && (
            <section aria-labelledby="rute-terkait">
              <h2
                id="rute-terkait"
                className="font-display text-2xl font-semibold text-ink-900"
              >
                {dict.destination.relatedRoutes}
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                {dict.destination.relatedRoutesDesc}
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {routes.slice(0, 2).map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-ink-900">
              {dict.destination.visitInfo}
            </h2>

            <div className="mt-5 space-y-5 text-sm">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Ticket className="h-4 w-4 text-brand-600" aria-hidden />
                  {dict.destination.ticket}
                </p>
                {ticketRows.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {ticketRows.map((row) => (
                      <li
                        key={row.label}
                        className="flex items-center justify-between gap-3 text-ink-700"
                      >
                        <span>{row.label}</span>
                        <span className="font-semibold text-ink-900">
                          {row.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-ink-600">
                    {dict.destination.noTicket}
                  </p>
                )}
                {ticket?.notes && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {ticket.notes}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Clock className="h-4 w-4 text-brand-600" aria-hidden />
                  {dict.destination.openHours}
                </p>
                {hours?.open || hours?.close ? (
                  <p className="mt-2 font-semibold text-ink-900">
                    {hours.open ?? "—"} – {hours.close ?? "—"}
                  </p>
                ) : (
                  <p className="mt-2 text-ink-600">
                    {dict.destination.noHours}
                  </p>
                )}
                {hours?.days && hours.days.length > 0 && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
                    <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {hours.days.join(", ")}
                  </p>
                )}
                {hours?.notes && (
                  <p className="mt-1 text-xs text-slate-500">{hours.notes}</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Check className="h-4 w-4 text-brand-600" aria-hidden />
                  {dict.destination.facilities}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {destination.facilities.length > 0 ? (
                    destination.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-ink-700"
                      >
                        {facility}
                      </span>
                    ))
                  ) : (
                    <span className="text-ink-600">
                      {dict.destination.noFacilities}
                    </span>
                  )}
                </div>
              </div>

              {destination.lat != null && destination.lng != null && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Car className="h-4 w-4 text-brand-600" aria-hidden />
                    {dict.destination.navigation}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                  >
                    {dict.destination.openMaps}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              )}
            </div>

            <Link
              href="/destinasi"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
              {dict.destination.backToCatalog}
            </Link>
          </div>

          <div className="mt-4 rounded-3xl border border-brand-100 bg-brand-50/70 p-5 text-sm leading-relaxed text-brand-900">
            <p className="inline-flex items-center gap-2 font-semibold">
              <Compass className="h-4 w-4" aria-hidden />
              {dict.destination.tipsTitle}
            </p>
            <p className="mt-2 text-brand-800/90">
              {dict.destination.tipsBody}
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                  {dict.destination.nearbyEyebrow}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">
                  {dict.destination.nearbyTitle}
                </h2>
              </div>
              <Link
                href="/destinasi"
                className="text-sm font-semibold text-brand-700 hover:underline"
              >
                {dict.common.viewAll}
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <DestinationCard key={item.id} destination={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
