export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function getOptional(formData: FormData, key: string): string | null {
  const value = getString(formData, key);
  return value === "" ? null : value;
}

export function getNumber(formData: FormData, key: string): number | null {
  const value = getString(formData, key).replace(/[^\d.-]/g, "");
  if (value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function isSafePath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}
