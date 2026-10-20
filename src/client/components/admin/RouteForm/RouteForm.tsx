"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import ImageUrlField from "@/client/components/admin/ImageUrlField";
import SaveButton from "@/client/components/admin/SaveButton";
import { createRoute, updateRoute } from "@/server/actions";
import type { Destination, RouteWithItems } from "@/types/db";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500";

type EditableItem = {
  key: string;
  destination_id: string;
  time_schedule: string;
  notes: string;
};

export default function RouteForm({
  route,
  destinations,
  cancelHref,
}: {
  route?: RouteWithItems | null;
  destinations: Destination[];
  cancelHref: string;
}) {
  const isEdit = Boolean(route);
  const [items, setItems] = useState<EditableItem[]>(() =>
    (route?.route_items ?? []).map((item) => ({
      key: item.id,
      destination_id: item.destination_id,
      time_schedule: item.time_schedule ?? "",
      notes: item.notes ?? "",
    })),
  );

  const itemsJson = JSON.stringify(
    items
      .filter((item) => item.destination_id)
      .map((item, index) => ({
        destination_id: item.destination_id,
        order_index: index,
        time_schedule: item.time_schedule,
        notes: item.notes,
      })),
  );

  function addItem() {
    const firstFree = destinations[0];
    const key =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((current) => [
      ...current,
      {
        key,
        destination_id: firstFree?.id ?? "",
        time_schedule: "",
        notes: "",
      },
    ]);
  }

  function updateItem(key: string, patch: Partial<EditableItem>) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  }

  function removeItem(key: string) {
    setItems((current) => current.filter((item) => item.key !== key));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={isEdit ? updateRoute : createRoute} className="space-y-6">
      {route && <input type="hidden" name="id" value={route.id} />}
      <input type="hidden" name="items" value={itemsJson} />

      <fieldset className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Informasi rute
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            Rute berstatus draf hanya terlihat oleh admin dan tidak muncul di
            situs publik.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className={labelClass}>
                Nama rute *
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={route?.title ?? ""}
                placeholder="Contoh: Jogja Heritage 2 Hari"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="slug" className={labelClass}>
                Slug URL
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={route?.slug ?? ""}
                placeholder="jogja-heritage-2-hari"
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Kosongkan untuk dibuat otomatis dari nama.
              </p>
            </div>

            <div>
              <label htmlFor="duration_days" className={labelClass}>
                Durasi (hari)
              </label>
              <input
                id="duration_days"
                name="duration_days"
                type="number"
                min={1}
                max={60}
                defaultValue={route?.duration_days ?? 1}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="status" className={labelClass}>
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={route?.status ?? "draft"}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="draft">Draf — hanya admin</option>
                <option value="published">Terbit — tampil publik</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="summary" className={labelClass}>
                Ringkasan
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                defaultValue={route?.summary ?? ""}
                placeholder="Jelaskan tema dan alur perjalanan rute ini."
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </div>

            <div className="sm:col-span-2 border-t border-slate-100 pt-4">
              <ImageUrlField
                name="cover_image"
                label="Gambar cover rute"
                defaultValue={route?.cover_image}
                bucket="covers"
                hint="Disarankan 1600×1000 px, format JPG/WebP, maksimal 5 MB."
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Itinerary
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                Susun urutan kunjungan. Nomor mengikuti posisi dari atas ke
                bawah.
              </p>
            </div>
            <button
              type="button"
              onClick={addItem}
              disabled={destinations.length === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Tambah perhentian
            </button>
          </div>

          {destinations.length === 0 && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Belum ada destinasi. Tambahkan destinasi terlebih dahulu sebelum
              menyusun rute.
            </p>
          )}

          {items.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <p className="text-sm font-medium text-ink-700">
                Belum ada perhentian
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Klik “Tambah perhentian” untuk memilih destinasi pertama.
              </p>
            </div>
          ) : (
            <ol className="mt-5 space-y-3">
              {items.map((item, index) => (
                <li
                  key={item.key}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="mt-1 inline-flex items-center gap-1.5 text-slate-400">
                      <GripVertical className="h-4 w-4" aria-hidden />
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-semibold text-ink-700 ring-1 ring-slate-200">
                        {index + 1}
                      </span>
                    </span>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr]">
                        <label className="block">
                          <span className="sr-only">Destinasi</span>
                          <select
                            required
                            value={item.destination_id}
                            onChange={(event) =>
                              updateItem(item.key, {
                                destination_id: event.target.value,
                              })
                            }
                            className={`${inputClass} cursor-pointer`}
                          >
                            <option value="">Pilih destinasi…</option>
                            {destinations.map((destination) => (
                              <option key={destination.id} value={destination.id}>
                                {destination.title}
                                {destination.city ? ` — ${destination.city}` : ""}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="sr-only">Jadwal</span>
                          <input
                            value={item.time_schedule}
                            onChange={(event) =>
                              updateItem(item.key, {
                                time_schedule: event.target.value,
                              })
                            }
                            placeholder="Hari 1 — 09:00"
                            className={inputClass}
                          />
                        </label>
                      </div>
                      <label className="block">
                        <span className="sr-only">Catatan</span>
                        <input
                          value={item.notes}
                          onChange={(event) =>
                            updateItem(item.key, { notes: event.target.value })
                          }
                          placeholder="Catatan untuk perhentian ini (opsional)"
                          className={inputClass}
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                        aria-label="Naikkan perhentian"
                      >
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === items.length - 1}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                        aria-label="Turunkan perhentian"
                      >
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50"
                        aria-label="Hapus perhentian"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </fieldset>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
        <p className="text-xs text-slate-500">
          {items.filter((item) => item.destination_id).length} perhentian siap
          disimpan.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={cancelHref}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            Batal
          </Link>
          <SaveButton label={isEdit ? "Simpan perubahan" : "Buat rute"} />
        </div>
      </div>
    </form>
  );
}
