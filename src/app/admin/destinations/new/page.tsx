import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DestinationForm from "@/client/components/admin/DestinationForm";
import FlashMessage from "@/client/components/admin/FlashMessage";

export const metadata: Metadata = { title: "Tambah Destinasi" };

type SearchParams = Promise<{ error?: string }>;

export default async function NewDestinationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke daftar destinasi
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
          Tambah destinasi
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Lengkapi informasi destinasi. Kolom bertanda * wajib diisi.
        </p>
      </div>

      <FlashMessage error={error} />

      <DestinationForm cancelHref="/admin/destinations" />
    </div>
  );
}
