import { DEFAULT_THEME, type ThemeColorKey, type ThemePreset } from "./types";

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "teal",
    label: "Teal (bawaan)",
    description: "Hijau kebiruan yang tenang, cocok untuk wisata alam.",
    theme: DEFAULT_THEME,
  },
  {
    id: "ocean",
    label: "Samudra",
    description: "Biru laut dengan aksen kuning hangat.",
    theme: { brand: "#0284c7", accent: "#f59e0b", ink: "#0b1220" },
  },
  {
    id: "forest",
    label: "Hutan",
    description: "Hijau daun yang segar dan natural.",
    theme: { brand: "#15803d", accent: "#d97706", ink: "#0f1a14" },
  },
  {
    id: "sunset",
    label: "Senja",
    description: "Merah muda dan jingga yang berani.",
    theme: { brand: "#e11d48", accent: "#f97316", ink: "#1c0f14" },
  },
  {
    id: "royal",
    label: "Royal",
    description: "Ungu elegan dengan aksen emas.",
    theme: { brand: "#7c3aed", accent: "#eab308", ink: "#140f24" },
  },
  {
    id: "stone",
    label: "Batu",
    description: "Netral dan profesional untuk konten budaya.",
    theme: { brand: "#475569", accent: "#0ea5e9", ink: "#0b1220" },
  },
];

/** Peta warna bawaan per peran agar pratinjau tetap punya acuan. */
export const DEFAULT_PALETTES: Record<ThemeColorKey, Record<string, string>> = {
  brand: {
    "50": "#f0fdfa",
    "100": "#ccfbf1",
    "200": "#99f6e4",
    "300": "#5eead4",
    "400": "#2dd4bf",
    "500": "#14b8a6",
    "600": "#0d9488",
    "700": "#0f766e",
    "800": "#115e59",
    "900": "#134e4a",
    "950": "#042f2e",
  },
  accent: {
    "50": "#fffbeb",
    "100": "#fef3c7",
    "200": "#fde68a",
    "300": "#fcd34d",
    "400": "#fbbf24",
    "500": "#f59e0b",
    "600": "#d97706",
    "700": "#b45309",
    "800": "#92400e",
    "900": "#78350f",
    "950": "#451a03",
  },
  ink: {
    "50": "#f6f7f9",
    "600": "#4b5563",
    "700": "#374151",
    "800": "#1f2937",
    "900": "#111827",
    "950": "#0b1220",
  },
};
