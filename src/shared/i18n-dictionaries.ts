import type { Locale } from "./i18n-config";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

export type Dictionary = typeof zh;

export const dictionaries: Record<Locale, Dictionary> = {
  zh,
  en,
};

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale] || dictionaries.zh;
