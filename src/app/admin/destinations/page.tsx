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
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";
import { interpolate } from "@/shared/i18n-config";
import { formatDate } from "@/shared/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.meta.destinations };
}

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
  const { locale, dict } = await getI18n();
  const t = dict.admin.destinations;
  const { q, error, saved } = await searchParams;
  const errorMessage = localizeText(error, locale);
  const savedMessage = localizeText(saved, locale);
  const destinations = await listDestinations({ q });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {dict.admin.common.content}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {q
              ? interpolate(t.countMatch, {
                  count: destinations.length,
                  query: q,
                })
              : interpolate(t.countSaved, { count: destinations.length })}
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t.add}
        </Link>
      </div>

      <FlashMessage error={errorMessage ?? undefined} saved={savedMessage ?? undefined} />

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
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            {dict.admin.common.search}
          </button>
        </form>

        {q && (
          <Link
            href="/admin/destinations"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t.resetSearch}
          </Link>
        )}
      </div>

      {destinations.length === 0 ? (
        <EmptyState
          title={q ? t.emptyTitle : t.emptyAllTitle}
          description={
            q ? t.emptyDesc : t.emptyAllDesc
          }
          actionHref={q ? "/admin/destinations" : "/admin/destinations/new"}
          actionLabel={q ? t.resetSearch : t.add}
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t.colDestination}</th>
                  <th className="px-4 py-3 font-semibold">{t.colCategory}</th>
                  <th className="px-4 py-3 font-semibold">{t.colPanorama}</th>
                  <th className="px-4 py-3 font-semibold">{t.colUpdated}</th>
                  <th className="px-5 py-3 text-right font-semibold">{t.colActions}</th>
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
                            {localizeText(destination.title, locale)}
                          </Link>
                          <p className="truncate text-xs text-slate-500">
                            /destinasi/{destination.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-ink-700">
                        {localizeText(destination.category, locale) ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {localizeText(destination.city, locale) ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {destination.panorama_url ? (
                        <Badge variant="brand">
                          <Orbit className="h-3 w-3" aria-hidden />
                          {t.available}
                        </Badge>
                      ) : (
                        <Badge variant="slate">{t.notAvailable}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(destination.updated_at, locale)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/destinations/${destination.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-slate-50"
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden />
                          {dict.admin.common.edit}
                        </Link>
                        <form action={deleteDestination}>
                          <input type="hidden" name="id" value={destination.id} />
                          <DeleteButton
                            confirmText={interpolate(t.deleteConfirm, {
                              title: localizeText(destination.title, locale) ?? "",
                            })}
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
