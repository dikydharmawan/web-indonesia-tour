"use client";

import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/client/i18n";
import { localizeText } from "@/shared/content-i18n";
import type { FilterOption } from "@/types/db";

type DestinationSearchProps = {
  categories: FilterOption[];
  cities: FilterOption[];
  defaults?: {
    q?: string;
    category?: string;
    city?: string;
  };
  className?: string;
};

export default function DestinationSearch({
  categories,
  cities,
  defaults,
  className,
}: DestinationSearchProps) {
  const router = useRouter();
  const { locale, dict } = useI18n();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const key of ["q", "category", "city"]) {
      const value = String(formData.get(key) ?? "").trim();
      if (value) params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/destinasi?${query}` : "/destinasi");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-white/60 bg-white/95 p-3 shadow-2xl shadow-ink-950/10 backdrop-blur sm:p-4 ${className ?? ""}`}
      role="search"
      aria-label={dict.search.aria}
    >
      <div className="flex flex-col gap-2 lg:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-500">
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <span className="sr-only">{dict.search.keyword}</span>
          <input
            type="search"
            name="q"
            defaultValue={defaults?.q ?? ""}
            placeholder={dict.search.placeholder}
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-500 lg:w-44">
          <span className="sr-only">{dict.search.category}</span>
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <select
            name="category"
            defaultValue={defaults?.category ?? ""}
            className="w-full cursor-pointer bg-transparent text-sm text-ink-700 outline-none"
          >
            <option value="">{dict.search.allCategories}</option>
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {localizeText(option.value, locale)} ({option.count})
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-500 lg:w-44">
          <span className="sr-only">{dict.search.city}</span>
          <select
            name="city"
            defaultValue={defaults?.city ?? ""}
            className="w-full cursor-pointer bg-transparent text-sm text-ink-700 outline-none"
          >
            <option value="">{dict.search.allCities}</option>
            {cities.map((option) => (
              <option key={option.value} value={option.value}>
                {localizeText(option.value, locale)} ({option.count})
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Search className="h-4 w-4" aria-hidden />
          {dict.search.submit}
        </button>
      </div>
    </form>
  );
}
