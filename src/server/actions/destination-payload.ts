import { getNumber, getOptional, getString, parseCommaList } from "./form";
import { slugify } from "@/shared/utils";

export type DestinationPayload = {
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  city: string | null;
  kecamatan: string | null;
  cover_image: string | null;
  panorama_url: string | null;
  lat: number | null;
  lng: number | null;
  ticket_info: Record<string, unknown> | null;
  opening_hours: Record<string, unknown> | null;
  facilities: string[];
};

export function parseDestinationForm(formData: FormData): DestinationPayload {
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);

  const adult = getNumber(formData, "ticket_adult");
  const child = getNumber(formData, "ticket_child");
  const vehicle = getNumber(formData, "ticket_vehicle");
  const ticketNotes = getOptional(formData, "ticket_notes");

  const open = getOptional(formData, "hours_open");
  const close = getOptional(formData, "hours_close");
  const days = parseCommaList(getString(formData, "hours_days"));
  const hoursNotes = getOptional(formData, "hours_notes");

  const hasTicket = adult != null || child != null || vehicle != null || ticketNotes;
  const hasHours = open || close || days.length > 0 || hoursNotes;

  return {
    title,
    slug,
    description: getOptional(formData, "description"),
    category: getOptional(formData, "category"),
    city: getOptional(formData, "city"),
    kecamatan: getOptional(formData, "kecamatan"),
    cover_image: getOptional(formData, "cover_image"),
    panorama_url: getOptional(formData, "panorama_url"),
    lat: getNumber(formData, "lat"),
    lng: getNumber(formData, "lng"),
    ticket_info: hasTicket
      ? {
          ...(adult != null ? { adult } : {}),
          ...(child != null ? { child } : {}),
          ...(vehicle != null ? { vehicle } : {}),
          ...(ticketNotes ? { notes: ticketNotes } : {}),
        }
      : null,
    opening_hours: hasHours
      ? {
          ...(open ? { open } : {}),
          ...(close ? { close } : {}),
          ...(days.length > 0 ? { days } : {}),
          ...(hoursNotes ? { notes: hoursNotes } : {}),
        }
      : null,
    facilities: parseCommaList(getString(formData, "facilities")),
  };
}
