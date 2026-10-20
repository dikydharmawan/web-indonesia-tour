import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_META,
  isLocale,
  type Locale,
} from "@/shared/i18n-config";
import { dictionaries, type Dictionary } from "@/shared/i18n-dictionaries";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getI18n(): Promise<{
  locale: Locale;
  dict: Dictionary;
  dir: "ltr" | "rtl";
  htmlLang: string;
}> {
  const locale = await getLocale();
  const meta = LOCALE_META[locale];

  return {
    locale,
    dict: dictionaries[locale],
    dir: meta.dir,
    htmlLang: meta.htmlLang,
  };
}
