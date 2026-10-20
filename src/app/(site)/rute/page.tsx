import type { Metadata } from "next";
import { Compass, Route as RouteIcon } from "lucide-react";
import RouteCard from "@/client/components/routes/RouteCard";
import EmptyState from "@/client/components/ui/EmptyState";
import { listRoutesWithItems } from "@/server/data/routes";
import { getI18n } from "@/server/i18n";
import { interpolate } from "@/shared/i18n-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: dict.routes.metaTitle,
    description: dict.routes.metaDesc,
  };
}

export default async function RoutesPage() {
  const { dict } = await getI18n();
  const routes = await listRoutesWithItems();

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {dict.routes.eyebrow}
          </p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                {dict.routes.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
                {dict.routes.desc}
              </p>
            </div>
            <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-700">
                <RouteIcon className="h-4 w-4" aria-hidden />
                {interpolate(dict.routes.available, {
                  count: routes.length,
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {routes.length === 0 ? (
            <EmptyState
              icon={Compass}
              title={dict.routes.emptyTitle}
              description={dict.routes.emptyDesc}
              actionHref="/destinasi"
              actionLabel={dict.routes.emptyAction}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
