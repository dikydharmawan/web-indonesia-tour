import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Orbit,
  Plus,
  Search,
} from "lucide-react";
import Badge from "@/client/components/ui/Badge";
import CoverImage from "@/client/components/ui/CoverImage";
import EmptyState from "@/client/components/ui/EmptyState";
import FlashMessage from "@/client/components/admin/FlashMessage";
import DeleteButton from "@/client/components/admin/DeleteButton";
import { deleteDestination } from "@/server/actions";
import { listDestinations } from "@/server/data/destinations";
import { formatDate } from "@/shared/utils";

export const metadata: Metadata = { title: "Destinasi" };

type SearchParams = Promise<{
  q?: string;
  error?: string;
  saved?: string;
}>;

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, error, saved } = await searchParams;
  const destinations = await listDestinations({ q });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Konten
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900">
            Destinasi
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {destinations.length} destinasi
            {q ? ` cocok dengan “${q}”` : " tersimpan"}.
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah destinasi
        </Link>
      </div>

      <FlashMessage error={error} saved={saved} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form
          action="/admin/destinations"
          method="get"
          className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Cari judul, kota, atau kategori…"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Cari
          </button>
        </form>

        {q && (
          <Link
            href="/admin/destinations"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Reset pencarian
          </Link>
        )}
      </div>

      {destinations.length === 0 ? (
        <EmptyState
          title={q ? "Destinasi tidak ditemukan" : "Belum ada destinasi"}
          description={
            q
              ? "Coba kata kunci lain atau reset pencarian."
              : "Tambahkan destinasi pertama untuk mulai membangun katalog wisata."
          }
          actionHref={q ? "/admin/destinations" : "/admin/destinations/new"}
          actionLabel={q ? "Reset pencarian" : "Tambah destinasi"}
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Destinasi</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Panorama</th>
                  <th className="px-4 py-3 font-semibold">Diperbarui</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {destinations.map((destination) => (
                  <tr key={destination.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <CoverImage
                          src={destination.cover_image}
                          alt={destination.title}
                          className="h-12 w-16 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/destinations/${destination.id}/edit`}
                            className="block truncate font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {destination.title}
                          </Link>
                          <p className="truncate text-xs text-slate-500">
                            /destinasi/{destination.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-ink-700">
                        {destination.category ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500">{destination.city ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      {destination.panorama_url ? (
                        <Badge variant="brand">
                          <Orbit className="h-3 w-3" aria-hidden />
                          Tersedia
                        </Badge>
                      ) : (
                        <Badge variant="slate">Belum ada</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(destination.updated_at)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/destinations/${destination.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-slate-50"
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden />
                          Edit
                        </Link>
                        <form action={deleteDestination}>
                          <input type="hidden" name="id" value={destination.id} />
                          <DeleteButton
                            confirmText={`Hapus destinasi “${destination.title}”? Destinasi juga akan dihapus dari semua rute.`}
                          />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
