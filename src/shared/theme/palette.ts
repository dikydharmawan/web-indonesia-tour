import { BLACK, WHITE, mix, normalizeHex, toHex, toRgb } from "./color";
import { DEFAULT_PALETTES } from "./presets";
import { DEFAULT_THEME, type ThemeColorKey, type ThemeSettings } from "./types";

const BRAND_STEPS: Array<[string, number]> = [
  ["50", 0.96],
  ["100", 0.9],
  ["200", 0.76],
  ["300", 0.56],
  ["400", 0.3],
  ["500", 0.14],
  ["600", 0],
  ["700", 0.14],
  ["800", 0.3],
  ["900", 0.44],
  ["950", 0.64],
];

const ACCENT_STEPS: Array<[string, number]> = [
  ["50", 0.95],
  ["100", 0.88],
  ["200", 0.72],
  ["300", 0.5],
  ["400", 0.24],
  ["500", 0],
  ["600", 0.12],
  ["700", 0.26],
  ["800", 0.4],
  ["900", 0.52],
  ["950", 0.7],
];

const INK_STEPS: Array<[string, number]> = [
  ["50", 0.96],
  ["600", 0.38],
  ["700", 0.24],
  ["800", 0.14],
  ["900", 0.06],
];

export function normalizeTheme(input: unknown): ThemeSettings {
  const raw =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const pick = (key: ThemeColorKey) => {
    const value = raw[key];
    return typeof value === "string"
      ? normalizeHex(value) ?? DEFAULT_THEME[key]
      : DEFAULT_THEME[key];
  };

  return {
    brand: pick("brand"),
    accent: pick("accent"),
    ink: pick("ink"),
  };
}

export function buildPalette(
  color: string,
  kind: ThemeColorKey,
): Record<string, string> {
  const normalized = normalizeHex(color) ?? DEFAULT_THEME[kind];
  if (normalized === DEFAULT_THEME[kind]) {
    return { ...DEFAULT_PALETTES[kind] };
  }

  const base = toRgb(normalized);

  if (kind === "ink") {
    const palette: Record<string, string> = {};
    for (const [shade, weight] of INK_STEPS) {
      palette[shade] = toHex(mix(base, WHITE, weight));
    }
    palette["950"] = normalized;
    return palette;
  }

  const steps = kind === "brand" ? BRAND_STEPS : ACCENT_STEPS;
  const palette: Record<string, string> = {};
  for (const [shade, weight] of steps) {
    if (weight === 0) {
      palette[shade] = normalized;
    } else {
      const pivot = kind === "brand" ? 600 : 500;
      const target = Number(shade) <= pivot ? WHITE : BLACK;
      palette[shade] = toHex(mix(base, target, weight));
    }
  }
  return palette;
}

export function themeCssVars(theme: ThemeSettings): Record<string, string> {
  const normalized = normalizeTheme(theme);
  const vars: Record<string, string> = {};

  (Object.keys(DEFAULT_THEME) as ThemeColorKey[]).forEach((key) => {
    if (normalized[key] === DEFAULT_THEME[key]) return;
    const palette = buildPalette(normalized[key], key);
    for (const [shade, color] of Object.entries(palette)) {
      vars[`--color-${key}-${shade}`] = color;
    }
  });

  return vars;
}

export function themesEqual(a: ThemeSettings, b: ThemeSettings): boolean {
  const left = normalizeTheme(a);
  const right = normalizeTheme(b);
  return (
    left.brand === right.brand &&
    left.accent === right.accent &&
    left.ink === right.ink
  );
}
