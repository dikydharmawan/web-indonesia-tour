import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import DestinationForm from "@/client/components/admin/DestinationForm";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { getDestinationById } from "@/server/data/destinations";
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { locale, dict } = await getI18n();
  const destination = await getDestinationById(id);
  return {
    title: destination
      ? `${dict.admin.form.editDestinationTitle}: ${localizeText(destination.title, locale)}`
      : dict.admin.form.editDestinationTitle,
  };
}

export default async function EditDestinationPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { locale, dict } = await getI18n();
  const t = dict.admin;
  const { error, saved } = await searchParams;
  const errorMessage = localizeText(error, locale);
  const savedMessage = localizeText(saved, locale);
  const destination = await getDestinationById(id);

  if (!destination) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t.form.backToDestinations}
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
            {t.form.editDestinationTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {localizeText(destination.title, locale)}
          </p>
        </div>
        <Link
          href={`/destinasi/${destination.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          {t.form.viewPublicPage}
        </Link>
      </div>

      <FlashMessage error={errorMessage ?? undefined} saved={savedMessage ?? undefined} />

      <DestinationForm
        destination={destination}
        cancelHref="/admin/destinations"
      />
    </div>
  );
}
