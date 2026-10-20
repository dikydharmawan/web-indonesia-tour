"use client";

import { useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";
import { useI18n } from "@/client/i18n";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_META,
  isLocale,
} from "@/shared/i18n-config";

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const { locale, dict } = useI18n();

  function change(value: string) {
    if (!isLocale(value) || value === locale) return;

    document.cookie = `${LOCALE_COOKIE}=${value};path=/;max-age=31536000;samesite=lax`;
    const meta = LOCALE_META[value];
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;
    router.refresh();
  }

  return (
    <label
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-ink-700 ${className}`}
    >
      <Globe2 className="h-3.5 w-3.5 text-brand-600" aria-hidden />
      <span className="sr-only">{dict.language.label}</span>
      <select
        value={locale}
        onChange={(event) => change(event.target.value)}
        aria-label={dict.language.label}
        className="cursor-pointer bg-transparent text-xs font-semibold text-ink-700 outline-none"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_META[code].short}
          </option>
        ))}
      </select>
    </label>
  );
}
