import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  Map,
  Orbit,
  Palette,
  Plus,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";
import Badge from "@/client/components/ui/Badge";
import CoverImage from "@/client/components/ui/CoverImage";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { getFilterOptions, listDestinations } from "@/server/data/destinations";
import { listRoutesWithItems } from "@/server/data/routes";
import { formatDate, formatDuration } from "@/shared/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Ringkasan" };

type SearchParams = Promise<{ error?: string; saved?: string }>;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, saved } = await searchParams;
  const [destinations, routes, filters] = await Promise.all([
    listDestinations(),
    listRoutesWithItems({ includeDrafts: true }),
    getFilterOptions(),
  ]);

  const published = routes.filter((route) => route.status === "published");
  const drafts = routes.filter((route) => route.status === "draft");
  const withPanorama = destinations.filter((item) => item.panorama_url);

  const recentDestinations = [...destinations]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total destinasi",
      value: destinations.length,
      detail: `${filters.cities.length} kota`,
      icon: Map,
      accent: "bg-brand-50 text-brand-700",
    },
    {
      label: "Panorama 360°",
      value: withPanorama.length,
      detail: `${destinations.length - withPanorama.length} belum memiliki`,
      icon: Orbit,
      accent: "bg-sky-50 text-sky-700",
    },
    {
      label: "Rute terbit",
      value: published.length,
      detail: `${drafts.length} draf tersimpan`,
      icon: RouteIcon,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Kategori",
      value: filters.categories.length,
      detail: filters.categories.map((item) => item.value).slice(0, 2).join(", ") || "—",
      icon: Sparkles,
      accent: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6">
      <FlashMessage error={error} saved={saved} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900">
            Ringkasan konten
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Pantau destinasi dan rute yang tampil di situs publik.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/destinations/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Tambah destinasi
          </Link>
          <Link
            href="/admin/routes/new"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            <RouteIcon className="h-4 w-4" aria-hidden />
            Buat rute
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
                  {stat.value}
                </p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${stat.accent}`}>
                <stat.icon className="h-5 w-5" aria-hidden />
              </span>
            </div>
            <p className="mt-2 truncate text-xs text-slate-500">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Destinasi terbaru
              </h2>
              <p className="text-xs text-slate-500">Diurutkan dari pembaruan terakhir.</p>
            </div>
            <Link
              href="/admin/destinations"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
            >
              Kelola
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          {recentDestinations.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Belum ada destinasi.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentDestinations.map((destination) => (
                <li key={destination.id}>
                  <Link
                    href={`/admin/destinations/${destination.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                  >
                    <CoverImage
                      src={destination.cover_image}
                      alt={destination.title}
                      className="h-12 w-16 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {destination.title}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {[destination.category, destination.city]
                          .filter(Boolean)
                          .join(" · ") || "Tanpa kategori"}
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      {destination.panorama_url ? (
                        <Badge variant="brand">
                          <Orbit className="h-3 w-3" aria-hidden />
                          360°
                        </Badge>
                      ) : (
                        <Badge variant="slate">
                          <ImageIcon className="h-3 w-3" aria-hidden />
                          Tanpa 360°
                        </Badge>
                      )}
                    </div>
                    <span className="hidden text-[11px] text-slate-400 md:block">
                      {formatDate(destination.updated_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Rute wisata
              </h2>
              <p className="text-xs text-slate-500">Status publikasi terkini.</p>
            </div>
            <Link
              href="/admin/routes"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
            >
              Kelola
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          {routes.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Belum ada rute.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {routes.slice(0, 5).map((route) => (
                <li key={route.id}>
                  <Link
                    href={`/admin/routes/${route.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {route.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDuration(route.duration_days)} ·{" "}
                        {route.route_items.length} destinasi
                      </p>
                    </div>
                    <Badge
                      variant={route.status === "published" ? "brand" : "amber"}
                    >
                      {route.status === "published" ? "Terbit" : "Draf"}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/destinations/new"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
            <Plus className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            Tambah destinasi baru
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Lengkapi info tiket, jam buka, dan panorama 360°.
          </p>
        </Link>
        <Link
          href="/admin/routes/new"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <RouteIcon className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            Susun rute perjalanan
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Atur urutan destinasi dan jadwal kunjungan.
          </p>
        </Link>
        <Link
          href="/"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
            <Orbit className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            Lihat situs publik
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Cek bagaimana konten tampil untuk pengunjung.
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
            <Palette className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            Atur tampilan situs
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Pilih warna tema atau gunakan preset yang tersedia.
          </p>
        </Link>
      </div>
    </div>
  );
}
