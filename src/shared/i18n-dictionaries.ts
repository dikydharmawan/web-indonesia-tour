import type { Locale } from "./i18n-config";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

export type Dictionary = typeof zh;

export const dictionaries: Record<Locale, Dictionary> = {
  zh,
  en,
  id: zh, // Use Chinese as fallback for ID for now, or you can create id.json
};

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale] || dictionaries.zh;
