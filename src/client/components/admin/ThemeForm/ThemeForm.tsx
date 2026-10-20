"use client";

import { useState } from "react";
import { Check, Palette, Sparkles } from "lucide-react";
import { saveTheme } from "@/server/actions";
import SaveButton from "@/client/components/admin/SaveButton";
import {
  buildPalette,
  normalizeHex,
  normalizeTheme,
  THEME_PRESETS,
  themesEqual,
  type ThemeColorKey,
  type ThemeSettings,
} from "@/shared/theme";
import { cn } from "@/shared/utils";

const FIELDS: Array<{
  key: ThemeColorKey;
  label: string;
  hint: string;
}> = [
  {
    key: "brand",
    label: "Warna utama",
    hint: "Tombol, tautan, ikon, dan sorotan utama.",
  },
  {
    key: "accent",
    label: "Warna aksen",
    hint: "Label kecil, lencana, dan elemen highlight.",
  },
  {
    key: "ink",
    label: "Warna gelap",
    hint: "Judul teks dan panel gelap. Pilih warna sangat gelap agar teks tetap terbaca.",
  },
];

export default function ThemeForm({ initial }: { initial: ThemeSettings }) {
  const [values, setValues] = useState<ThemeSettings>(() =>
    normalizeTheme(initial),
  );
  const [text, setText] = useState<Record<ThemeColorKey, string>>(() =>
    normalizeTheme(initial),
  );

  const palettes = {
    brand: buildPalette(values.brand, "brand"),
    accent: buildPalette(values.accent, "accent"),
    ink: buildPalette(values.ink, "ink"),
  };

  function pick(key: ThemeColorKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setText((current) => ({ ...current, [key]: value }));
  }

  function type(key: ThemeColorKey, value: string) {
    setText((current) => ({ ...current, [key]: value }));
    const normalized = normalizeHex(value);
    if (normalized) {
      setValues((current) => ({ ...current, [key]: normalized }));
    }
  }

  function applyPreset(theme: ThemeSettings) {
    const normalized = normalizeTheme(theme);
    setValues(normalized);
    setText(normalized);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
      <form
        action={saveTheme}
        className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <Palette className="h-4 w-4 text-brand-700" aria-hidden />
            Palet warna
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Pilih preset lalu sesuaikan bila perlu. Perubahan langsung dipakai
            di seluruh halaman publik dan dashboard.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Preset
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {THEME_PRESETS.map((preset) => {
              const active = themesEqual(preset.theme, values);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.theme)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition",
                    active
                      ? "border-brand-400 bg-brand-50 ring-1 ring-brand-300"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <span className="flex shrink-0 -space-x-1.5">
                    {(["brand", "accent", "ink"] as ThemeColorKey[]).map(
                      (key) => (
                        <span
                          key={key}
                          className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: preset.theme[key] }}
                        />
                      ),
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-900">
                      {preset.label}
                      {active && (
                        <Check
                          className="h-3.5 w-3.5 text-brand-700"
                          aria-hidden
                        />
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                      {preset.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-5">
          {FIELDS.map((field) => {
            const value = text[field.key];
            const invalid = normalizeHex(value) === null;
            return (
              <div
                key={field.key}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <label
                    htmlFor={`theme-${field.key}`}
                    className="text-sm font-semibold text-ink-900"
                  >
                    {field.label}
                  </label>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    {field.hint}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <input
                    type="color"
                    value={values[field.key]}
                    onChange={(event) => pick(field.key, event.target.value)}
                    aria-label={`Pilih ${field.label.toLowerCase()}`}
                    className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 bg-white p-0.5"
                  />
                  <input
                    id={`theme-${field.key}`}
                    name={field.key}
                    value={value}
                    onChange={(event) => type(field.key, event.target.value)}
                    required
                    spellCheck={false}
                    autoComplete="off"
                    pattern="^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
                    title="Gunakan format hex, misalnya #0d9488"
                    className={cn(
                      "w-28 rounded-xl border px-3 py-2 font-mono text-xs uppercase text-ink-900 outline-none transition focus:ring-2",
                      invalid
                        ? "border-rose-300 bg-rose-50 focus:ring-rose-200"
                        : "border-slate-200 bg-white focus:border-brand-400 focus:ring-brand-100",
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <p className="text-[11px] text-slate-500">
            Tema tersimpan permanen di database.
          </p>
          <SaveButton label="Simpan tema" />
        </div>
      </form>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <Sparkles className="h-4 w-4 text-brand-700" aria-hidden />
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Pratinjau
          </h2>
        </div>

        <div className="p-4 sm:p-5">
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: palettes.ink[800] }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3"
              style={{ backgroundColor: palettes.ink[950] }}
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: palettes.brand[300] }}
              >
                Jelajah Nusantara
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white"
                style={{ backgroundColor: palettes.brand[700] }}
              >
                Jelajahi
              </span>
            </div>

            <div
              className="space-y-3 p-4"
              style={{ backgroundColor: palettes.ink[50] }}
            >
              <span
                className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold"
                style={{
                  backgroundColor: palettes.accent[100],
                  color: palettes.accent[900],
                }}
              >
                Panorama 360°
              </span>
              <div>
                <p
                  className="font-display text-lg font-semibold"
                  style={{ color: palettes.ink[900] }}
                >
                  Candi Borobudur
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: palettes.ink[600] }}
                >
                  Susuri lorong relief dan nikmati matahari terbit dari teras
                  candi.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: palettes.brand[700] }}
                >
                  Lihat rute
                </span>
                <span
                  className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold"
                  style={{
                    borderColor: palettes.brand[200],
                    color: palettes.brand[800],
                  }}
                >
                  Detail
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Pratinjau memakai palet yang dihasilkan otomatis dari tiga warna di
            atas. Warna bawaan mempertahankan tampilan awal situs.
          </p>
        </div>
      </section>
    </div>
  );
}
