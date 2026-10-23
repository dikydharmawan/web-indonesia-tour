import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DestinationForm from "@/client/components/admin/DestinationForm";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.meta.newDestination };
}

type SearchParams = Promise<{ error?: string }>;

export default async function NewDestinationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, dict } = await getI18n();
  const t = dict.admin;
  const { error } = await searchParams;
  const errorMessage = localizeText(error, locale);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t.form.backToDestinations}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
          {t.form.addDestinationAction}
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          {t.form.newDestinationDesc}
        </p>
      </div>

      <FlashMessage error={errorMessage ?? undefined} />

      <DestinationForm cancelHref="/admin/destinations" />
    </div>
  );
}
