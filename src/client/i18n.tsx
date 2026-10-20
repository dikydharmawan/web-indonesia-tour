"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  type Locale,
} from "@/shared/i18n-config";
import { dictionaries, type Dictionary } from "@/shared/i18n-dictionaries";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useI18n(): {
  locale: Locale;
  dict: Dictionary;
  dir: "ltr" | "rtl";
} {
  const locale = useContext(LocaleContext);
  return { locale, dict: dictionaries[locale], dir: LOCALE_META[locale].dir };
}
