export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

import { LOCALE_META, type Locale } from "@/shared/i18n-config";

export function formatDate(
  value: string | Date,
  locale: Locale = "zh",
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(LOCALE_META[locale].htmlLang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDuration(days: number, locale: Locale = "zh"): string {
  return new Intl.NumberFormat(LOCALE_META[locale].htmlLang, {
    style: "unit",
    unit: "day",
    unitDisplay: "long",
  }).format(days);
}

export function truncate(value: string | null | undefined, length = 140): string {
  if (!value) return "";
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}
