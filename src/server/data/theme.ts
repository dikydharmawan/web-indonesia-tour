import "server-only";

import { query, queryOne } from "@/server/db";
import { normalizeTheme, type ThemeSettings } from "@/shared/theme";

export async function getThemeSettings(): Promise<ThemeSettings> {
  try {
    const row = await queryOne<{ value: unknown }>(
      "select value from public.site_settings where key = 'theme' limit 1",
    );
    if (!row) return normalizeTheme(null);
    return normalizeTheme(row.value);
  } catch {
    return normalizeTheme(null);
  }
}

export async function saveThemeSettings(
  theme: ThemeSettings,
): Promise<ThemeSettings> {
  const normalized = normalizeTheme(theme);

  await query(
    `insert into public.site_settings (key, value)
     values ('theme', $1::jsonb)
     on conflict (key) do update set value = excluded.value`,
    [JSON.stringify(normalized)],
  );

  return normalized;
}
