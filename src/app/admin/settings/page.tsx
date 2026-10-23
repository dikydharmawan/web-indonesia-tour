import type { Metadata } from "next";
import { Map, Palette, Route as RouteIcon } from "lucide-react";
import FlashMessage from "@/client/components/admin/FlashMessage";
import ThemeForm from "@/client/components/admin/ThemeForm";
import { getThemeSettings } from "@/server/data/theme";
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.meta.settings };
}

type SearchParams = Promise<{ error?: string; saved?: string }>;

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, dict } = await getI18n();
  const t = dict.admin.theme;
  const { error, saved } = await searchParams;
  const errorMessage = localizeText(error, locale);
  const savedMessage = localizeText(saved, locale);
  const theme = await getThemeSettings();

  const configSummary = [
    {
      icon: Map,
      title: t.destGroup,
      items: [t.destItem1, t.destItem2, t.destItem3, t.destItem4],
    },
    {
      icon: RouteIcon,
      title: t.routeGroup,
      items: [t.routeItem1, t.routeItem2, t.routeItem3],
    },
    {
      icon: Palette,
      title: t.appearanceGroup,
      items: [t.appearanceItem1, t.appearanceItem2, t.appearanceItem3],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          {t.eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-ink-600">{t.desc}</p>
      </div>

      <FlashMessage
        error={errorMessage ?? undefined}
        saved={savedMessage ?? undefined}
      />

      <ThemeForm initial={theme} />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          {t.configTitle}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{t.configDesc}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {configSummary.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <group.icon className="h-4 w-4 text-brand-700" aria-hidden />
                {group.title}
              </p>
              <ul className="mt-2 space-y-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-600"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
