export type ThemeSettings = {
  brand: string;
  accent: string;
  ink: string;
};

export type ThemeColorKey = keyof ThemeSettings;

export type ThemePreset = {
  id: string;
  label: string;
  description: string;
  theme: ThemeSettings;
};

export const DEFAULT_THEME: ThemeSettings = {
  brand: "#0d9488",
  accent: "#f59e0b",
  ink: "#0b1220",
};
