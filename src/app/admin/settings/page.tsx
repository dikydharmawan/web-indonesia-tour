import type { Metadata } from "next";
import { Map, Palette, Route as RouteIcon } from "lucide-react";
import FlashMessage from "@/client/components/admin/FlashMessage";
import ThemeForm from "@/client/components/admin/ThemeForm";
import { getThemeSettings } from "@/server/data/theme";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tampilan" };

type SearchParams = Promise<{ error?: string; saved?: string }>;

const CONFIG_SUMMARY = [
  {
    icon: Map,
    title: "Destinasi",
    items: [
      "Judul, slug, deskripsi, kategori, kota",
      "Gambar cover dan panorama 360°",
      "Koordinat peta, info tiket, jam buka",
      "Daftar fasilitas",
    ],
  },
  {
    icon: RouteIcon,
    title: "Rute wisata",
    items: [
      "Judul, slug, ringkasan, durasi",
      "Gambar cover dan status draf/terbit",
      "Urutan destinasi, jadwal, catatan",
    ],
  },
  {
    icon: Palette,
    title: "Tampilan",
    items: [
      "Warna utama (tombol dan tautan)",
      "Warna aksen (label dan highlight)",
      "Warna gelap (judul dan panel)",
    ],
  },
];

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, saved } = await searchParams;
  const theme = await getThemeSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Pengaturan
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900">
          Tampilan & tema
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Sesuaikan warna situs agar selaras dengan identitas destinasi Anda.
        </p>
      </div>

      <FlashMessage error={error} saved={saved} />

      <ThemeForm initial={theme} />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Yang bisa diatur dari admin
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Ringkasan konten dan tampilan yang tersedia di dashboard.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {CONFIG_SUMMARY.map((group) => (
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
