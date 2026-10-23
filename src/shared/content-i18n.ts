import type { Locale } from "./i18n-config";
import type {
  Destination,
  OpeningHours,
  RouteItem,
  RouteWithItems,
  TicketInfo,
} from "@/types/db";

type Translation = Partial<Record<Locale, string>>;

/**
 * Terjemahan istilah/konten yang tersimpan di database.
 * Kunci memakai teks sumber (Bahasa Indonesia). Jika tidak ada padanan,
 * teks asli dikembalikan agar konten baru tetap tampil.
 */
const CONTENT_TERMS: Record<string, Translation> = {
  "Fly Bali": { zh: "巴厘岛飞行", en: "Fly Bali", ar: "فلاي بالي" },
  "Nuanu Creative City": {
    zh: "努阿努创意城",
    en: "Nuanu Creative City",
    ar: "نوانو الإبداعية",
  },
  CandyLand: { zh: "糖果乐园", en: "CandyLand", ar: "كاندي لاند" },
  "Keliling Bali dengan helikopter": {
    zh: "乘坐直升机环游巴厘岛",
    en: "Tour Bali by helicopter",
    ar: "جولة حول بالي بالطائرة المروحية",
  },
  "Magic Garden, Kec. Kediri, Kab. Tabanan, Bali": {
    zh: "巴厘岛塔巴南县克迪里区魔法花园",
    en: "Magic Garden, Kediri, Tabanan, Bali",
    ar: "الحديقة السحرية، كيديري، تبانان، بالي",
  },
  "Dunia permen": { zh: "糖果世界", en: "A world of candy", ar: "عالم الحلوى" },
  Real: { zh: "真实", en: "Real", ar: "واقعي" },
  Fantasy: { zh: "奇幻", en: "Fantasy", ar: "خيالي" },
  Wisata: { zh: "旅游", en: "Tourism", ar: "سياحة" },
  Bali: { zh: "巴厘岛", en: "Bali", ar: "بالي" },
  Tabanan: { zh: "塔巴南", en: "Tabanan", ar: "تبانان" },
  Helikopter: { zh: "直升机", en: "Helicopter", ar: "طائرة مروحية" },
  Pemandu: { zh: "导游", en: "Guide", ar: "مرشد" },
  Parkir: { zh: "停车场", en: "Parking", ar: "موقف سيارات" },
  Toilet: { zh: "洗手间", en: "Restroom", ar: "دورة مياه" },
  Taman: { zh: "花园", en: "Garden", ar: "حديقة" },
  Permen: { zh: "糖果", en: "Candy", ar: "حلوى" },
  Keajaiban: { zh: "奇迹", en: "Wonder", ar: "عجائب" },
  "Harga per orang.": {
    zh: "每人价格。",
    en: "Price per person.",
    ar: "السعر لكل شخص.",
  },
  "Harga tiket masuk Magic Garden.": {
    zh: "魔法花园门票价格。",
    en: "Magic Garden admission price.",
    ar: "سعر دخول الحديقة السحرية.",
  },
  "Gratis untuk semua.": {
    zh: "所有人免费。",
    en: "Free for everyone.",
    ar: "مجانًا للجميع.",
  },
  "Eksplorasi Bali & Fantasi": {
    zh: "探索巴厘岛与奇幻",
    en: "Bali & Fantasy Exploration",
    ar: "استكشاف بالي والخيال",
  },
  "Keliling Bali dengan helikopter, menikmati Magic Garden, dan bermain di dunia permen.":
    {
      zh: "乘坐直升机环游巴厘岛，游览魔法花园，并畅玩糖果世界。",
      en: "Tour Bali by helicopter, enjoy Magic Garden, and play in a world of candy.",
      ar: "جولة حول بالي بالطائرة المروحية، واستمتع بالحديقة السحرية، والعب في عالم الحلوى.",
    },
  "Magic Garden di Tabanan": {
    zh: "塔巴南的魔法花园",
    en: "Magic Garden in Tabanan",
    ar: "الحديقة السحرية في تبانان",
  },
  "Bermain di dunia permen": {
    zh: "在糖果世界中游玩",
    en: "Play in a world of candy",
    ar: "اللعب في عالم الحلوى",
  },
  Senin: { zh: "星期一", en: "Monday", ar: "الاثنين" },
  Selasa: { zh: "星期二", en: "Tuesday", ar: "الثلاثاء" },
  Rabu: { zh: "星期三", en: "Wednesday", ar: "الأربعاء" },
  Kamis: { zh: "星期四", en: "Thursday", ar: "الخميس" },
  Jumat: { zh: "星期五", en: "Friday", ar: "الجمعة" },
  Sabtu: { zh: "星期六", en: "Saturday", ar: "السبت" },
  Minggu: { zh: "星期日", en: "Sunday", ar: "الأحد" },
};

export function localizeText(
  value: string | null | undefined,
  locale: Locale,
): string | null {
  if (!value) return value ?? null;
  if (locale === "id") return value;
  return CONTENT_TERMS[value]?.[locale] ?? value;
}

export function localizeList(values: string[], locale: Locale): string[] {
  return values.map((value) => localizeText(value, locale) ?? value);
}

function localizeTicket(
  ticket: TicketInfo | null,
  locale: Locale,
): TicketInfo | null {
  if (!ticket) return ticket;
  return {
    ...ticket,
    notes: localizeText(ticket.notes, locale) ?? undefined,
  };
}

function localizeHours(
  hours: OpeningHours | null,
  locale: Locale,
): OpeningHours | null {
  if (!hours) return hours;
  return {
    ...hours,
    days: hours.days ? localizeList(hours.days, locale) : hours.days,
    notes: localizeText(hours.notes, locale) ?? undefined,
  };
}

export function localizeDestination(
  destination: Destination,
  locale: Locale,
): Destination {
  return {
    ...destination,
    title: localizeText(destination.title, locale) ?? destination.title,
    description: localizeText(destination.description, locale),
    category: localizeText(destination.category, locale),
    city: localizeText(destination.city, locale),
    facilities: localizeList(destination.facilities, locale),
    ticket_info: localizeTicket(destination.ticket_info, locale),
    opening_hours: localizeHours(destination.opening_hours, locale),
  };
}

export function localizeRouteItem(item: RouteItem, locale: Locale): RouteItem {
  return {
    ...item,
    notes: localizeText(item.notes, locale),
    destination: item.destination
      ? localizeDestination(item.destination, locale)
      : item.destination,
  };
}

export function localizeRoute(
  route: RouteWithItems,
  locale: Locale,
): RouteWithItems {
  return {
    ...route,
    title: localizeText(route.title, locale) ?? route.title,
    summary: localizeText(route.summary, locale),
    route_items: (route.route_items ?? []).map((item) =>
      localizeRouteItem(item, locale),
    ),
  };
}
