export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDuration(days: number): string {
  return days === 1 ? "1 hari" : `${days} hari`;
}

export function truncate(value: string | null | undefined, length = 140): string {
  if (!value) return "";
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}
