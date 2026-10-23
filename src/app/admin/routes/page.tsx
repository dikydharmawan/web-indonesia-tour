import type { Metadata } from "next";
import Link from "next/link";
import {
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Route as RouteIcon,
} from "lucide-react";
import Badge from "@/client/components/ui/Badge";
import CoverImage from "@/client/components/ui/CoverImage";
import EmptyState from "@/client/components/ui/EmptyState";
import FlashMessage from "@/client/components/admin/FlashMessage";
import DeleteButton from "@/client/components/admin/DeleteButton";
import {
  deleteRoute,
  toggleRouteStatus,
} from "@/server/actions";
import { listRoutesWithItems } from "@/server/data/routes";
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";
import { interpolate } from "@/shared/i18n-config";
import { formatDate, formatDuration } from "@/shared/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.meta.routes };
}

type SearchParams = Promise<{ error?: string; saved?: string }>;

export default async function AdminRoutesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, dict } = await getI18n();
  const t = dict.admin.routes;
  const { error, saved } = await searchParams;
  const errorMessage = localizeText(error, locale);
  const savedMessage = localizeText(saved, locale);
  const routes = await listRoutesWithItems({ includeDrafts: true });
  const published = routes.filter((route) => route.status === "published").length;

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
            {interpolate(t.summary, {
              total: routes.length,
              published,
              draft: routes.length - published,
            })}
          </p>
        </div>
        <Link
          href="/admin/routes/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t.create}
        </Link>
      </div>

      <FlashMessage error={errorMessage ?? undefined} saved={savedMessage ?? undefined} />

      {routes.length === 0 ? (
        <EmptyState
          icon={RouteIcon}
          title={t.emptyTitle}
          description={t.emptyDesc}
          actionHref="/admin/routes/new"
          actionLabel={t.emptyAction}
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t.colRoute}</th>
                  <th className="px-4 py-3 font-semibold">{t.colStatus}</th>
                  <th className="px-4 py-3 font-semibold">{t.colItinerary}</th>
                  <th className="px-4 py-3 font-semibold">{t.colUpdated}</th>
                  <th className="px-5 py-3 text-right font-semibold">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {routes.map((route) => {
                  const nextStatus =
                    route.status === "published" ? "draft" : "published";
                  return (
                    <tr key={route.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <CoverImage
                            src={route.cover_image}
                            alt={route.title}
                            className="h-12 w-16 shrink-0 rounded-lg"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/admin/routes/${route.id}/edit`}
                              className="block truncate font-semibold text-ink-900 hover:text-brand-700"
                            >
                              {localizeText(route.title, locale)}
                            </Link>
                            <p className="truncate text-xs text-slate-500">
                              {formatDuration(route.duration_days, locale)} ·
                              /rute/{route.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={route.status === "published" ? "brand" : "amber"}
                        >
                          {route.status === "published"
                            ? dict.admin.common.published
                            : dict.admin.common.draft}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ol className="max-w-[240px] space-y-0.5">
                          {route.route_items.slice(0, 3).map((item, index) => (
                            <li
                              key={item.id}
                              className="truncate text-xs text-slate-600"
                            >
                              {index + 1}.{" "}
                              {localizeText(item.destination?.title, locale) ?? "—"}
                            </li>
                          ))}
                          {route.route_items.length > 3 && (
                            <li className="text-[11px] text-slate-400">
                              {interpolate(t.moreStops, {
                                count: route.route_items.length - 3,
                              })}
                            </li>
                          )}
                          {route.route_items.length === 0 && (
                            <li className="text-xs text-amber-700">
                              {t.noStops}
                            </li>
                          )}
                        </ol>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {formatDate(route.updated_at, locale)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <form action={toggleRouteStatus}>
                            <input type="hidden" name="id" value={route.id} />
                            <input type="hidden" name="status" value={nextStatus} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-slate-50"
                            >
                              {route.status === "published" ? (
                                <>
                                  <EyeOff className="h-3.5 w-3.5" aria-hidden />
                                  {t.makeDraft}
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3.5 w-3.5" aria-hidden />
                                  {t.publish}
                                </>
                              )}
                            </button>
                          </form>
                          <Link
                            href={`/admin/routes/${route.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-slate-50"
                          >
                            <Edit3 className="h-3.5 w-3.5" aria-hidden />
                            {dict.admin.common.edit}
                          </Link>
                          <form action={deleteRoute}>
                            <input type="hidden" name="id" value={route.id} />
                            <DeleteButton
                              confirmText={interpolate(t.deleteConfirm, {
                                title: localizeText(route.title, locale) ?? "",
                              })}
                            />
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
