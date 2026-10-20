export const LOCALES = ["zh", "en", "ar", "id"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";

export const LOCALE_COOKIE = "locale";

export const LOCALE_META: Record<
  Locale,
  { label: string; short: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  zh: { label: "简体中文", short: "中文", dir: "ltr", htmlLang: "zh-CN" },
  en: { label: "English", short: "English", dir: "ltr", htmlLang: "en" },
  ar: { label: "العربية", short: "العربية", dir: "rtl", htmlLang: "ar" },
  id: { label: "Bahasa Indonesia", short: "Indonesia", dir: "ltr", htmlLang: "id" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function interpolate(
  template: string,
  values?: Record<string, string | number>,
) {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
