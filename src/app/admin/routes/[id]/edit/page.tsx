import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import RouteForm from "@/client/components/admin/RouteForm";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { listDestinations } from "@/server/data/destinations";
import { getRouteById } from "@/server/data/routes";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const route = await getRouteById(id);
  return { title: route ? `Edit: ${route.title}` : "Edit Rute" };
}

export default async function EditRoutePage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const [route, destinations] = await Promise.all([
    getRouteById(id),
    listDestinations(),
  ]);

  if (!route) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/routes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Kembali ke daftar rute
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
            Edit rute
          </h1>
          <p className="mt-1 text-sm text-ink-600">{route.title}</p>
        </div>
        {route.status === "published" && (
          <Link
            href={`/rute/${route.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Lihat halaman publik
          </Link>
        )}
      </div>

      <FlashMessage error={error} saved={saved} />

      <RouteForm
        route={route}
        destinations={destinations}
        cancelHref="/admin/routes"
      />
    </div>
  );
}
