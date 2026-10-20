import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RouteForm from "@/client/components/admin/RouteForm";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { listDestinations } from "@/server/data/destinations";

export const metadata: Metadata = { title: "Buat Rute" };

type SearchParams = Promise<{ error?: string }>;

export default async function NewRoutePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const destinations = await listDestinations();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/routes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke daftar rute
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
          Buat rute baru
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Tentukan informasi rute, lalu susun urutan destinasi yang dikunjungi.
        </p>
      </div>

      <FlashMessage error={error} />

      <RouteForm destinations={destinations} cancelHref="/admin/routes" />
    </div>
  );
}
