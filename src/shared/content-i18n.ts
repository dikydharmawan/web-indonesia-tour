import type { Locale } from "./i18n-config";
import type {
  Destination,
  OpeningHours,
  RouteItem,
  RouteWithItems,
  TicketInfo,
} from "@/types/db";

type Translation = Partial<Record<"zh" | "en" | "id", string>>;

/**
 * Terjemahan istilah/konten yang tersimpan di database.
 * Kunci memakai teks sumber (Bahasa Indonesia). Jika tidak ada padanan,
 * teks asli dikembalikan agar konten baru tetap tampil.
 */
const CONTENT_TERMS: Record<string, Translation> = {
  "Fly Bali": { zh: "巴厘岛飞行", en: "Fly Bali" },
  "Nuanu Creative City": {
    zh: "努阿努创意城",
    en: "Nuanu Creative City",
  },
  CandyLand: { zh: "糖果乐园", en: "CandyLand" },
  "Keliling Bali dengan helikopter": {
    zh: "乘坐直升机环游巴厘岛",
    en: "Tour Bali by helicopter",
  },
  "Magic Garden, Kec. Kediri, Kab. Tabanan, Bali": {
    zh: "巴厘岛塔巴南县克迪里区魔法花园",
    en: "Magic Garden, Kediri, Tabanan, Bali",
  },
  "Dunia permen": { zh: "糖果世界", en: "A world of candy" },
  Real: { zh: "真实", en: "Real" },
  Fantasy: { zh: "奇幻", en: "Fantasy" },
  Wisata: { zh: "旅游", en: "Tourism" },
  Bali: { zh: "巴厘岛", en: "Bali" },
  Tabanan: { zh: "塔巴南", en: "Tabanan" },
  Helikopter: { zh: "直升机", en: "Helicopter" },
  Pemandu: { zh: "导游", en: "Guide" },
  Parkir: { zh: "停车场", en: "Parking" },
  Toilet: { zh: "洗手间", en: "Restroom" },
  Taman: { zh: "花园", en: "Garden" },
  Permen: { zh: "糖果", en: "Candy" },
  Keajaiban: { zh: "奇迹", en: "Wonder" },
  "Harga per orang.": {
    zh: "每人价格。",
    en: "Price per person.",
  },
  "Harga tiket masuk Magic Garden.": {
    zh: "魔法花园门票价格。",
    en: "Magic Garden admission price.",
  },
  "Gratis untuk semua.": {
    zh: "所有人免费。",
    en: "Free for everyone.",
  },
  "Eksplorasi Bali & Fantasi": {
    zh: "探索巴厘岛与奇幻",
    en: "Bali & Fantasy Exploration",
  },
  "Keliling Bali dengan helikopter, menikmati Magic Garden, dan bermain di dunia permen.":
    {
      zh: "乘坐直升机环游巴厘岛，游览魔法花园，并畅玩糖果世界。",
      en: "Tour Bali by helicopter, enjoy Magic Garden, and play in a world of candy.",
    },
  "Magic Garden di Tabanan": {
    zh: "塔巴南的魔法花园",
    en: "Magic Garden in Tabanan",
  },
  "Bermain di dunia permen": {
    zh: "在糖果世界中游玩",
    en: "Play in a world of candy",
  },
  Senin: { zh: "星期一", en: "Monday" },
  Selasa: { zh: "星期二", en: "Tuesday" },
  Rabu: { zh: "星期三", en: "Wednesday" },
  Kamis: { zh: "星期四", en: "Thursday" },
  Jumat: { zh: "星期五", en: "Friday" },
  Sabtu: { zh: "星期六", en: "Saturday" },
  Minggu: { zh: "星期日", en: "Sunday" },
  "Teal (bawaan)": { zh: "青绿色（默认）", en: "Teal (default)" },
  Samudra: { zh: "海洋", en: "Ocean" },
  Hutan: { zh: "森林", en: "Forest" },
  Senja: { zh: "黄昏", en: "Sunset" },
  Royal: { zh: "皇家", en: "Royal" },
  Batu: { zh: "岩石", en: "Stone" },
  "Hijau kebiruan yang tenang, cocok untuk wisata alam.": {
    zh: "宁静的青绿色，适合自然旅游。",
    en: "A calm teal, suited to nature tourism.",
  },
  "Biru laut dengan aksen kuning hangat.": {
    zh: "海蓝色搭配温暖的黄色点缀。",
    en: "Sea blue with warm yellow accents.",
  },
  "Hijau daun yang segar dan natural.": {
    zh: "清新自然的叶绿色。",
    en: "Fresh, natural leaf green.",
  },
  "Merah muda dan jingga yang berani.": {
    zh: "大胆的粉红色与橙色。",
    en: "Bold pink and orange.",
  },
  "Ungu elegan dengan aksen emas.": {
    zh: "优雅的紫色搭配金色点缀。",
    en: "Elegant purple with gold accents.",
  },
  "Netral dan profesional untuk konten budaya.": {
    zh: "中性而专业，适合文化内容。",
    en: "Neutral and professional for cultural content.",
  },
  "Email dan kata sandi wajib diisi.": {
    zh: "请输入邮箱和密码。",
    en: "Email and password are required.",
  },
  "Email atau kata sandi salah.": {
    zh: "邮箱或密码错误。",
    en: "Incorrect email or password.",
  },
  "Judul dan slug wajib diisi.": {
    zh: "标题和标识为必填项。",
    en: "Title and slug are required.",
  },
  "ID destinasi tidak valid.": {
    zh: "目的地 ID 无效。",
    en: "Invalid destination ID.",
  },
  "Perubahan destinasi berhasil disimpan.": {
    zh: "目的地更改已成功保存。",
    en: "Destination changes saved successfully.",
  },
  "Destinasi berhasil dihapus.": {
    zh: "目的地已成功删除。",
    en: "Destination deleted successfully.",
  },
  "ID rute tidak valid.": {
    zh: "路线 ID 无效。",
    en: "Invalid route ID.",
  },
  "Perubahan rute berhasil disimpan.": {
    zh: "路线更改已成功保存。",
    en: "Route changes saved successfully.",
  },
  "Rute berhasil dihapus.": {
    zh: "路线已成功删除。",
    en: "Route deleted successfully.",
  },
  "Tema berhasil disimpan.": {
    zh: "主题已成功保存。",
    en: "Theme saved successfully.",
  },
  "Terjadi kesalahan tak terduga.": {
    zh: "发生意外错误。",
    en: "An unexpected error occurred.",
  },
  "Slug sudah dipakai. Pilih slug lain.": {
    zh: "该标识已被使用。请选择其他标识。",
    en: "This slug is already in use. Choose another slug.",
  },
  "Data tidak valid. Periksa kembali isian formulir.": {
    zh: "数据无效。请检查表单填写。",
    en: "Invalid data. Please check the form entries.",
  },
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
