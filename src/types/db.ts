export type TicketInfo = {
  adult?: number;
  child?: number;
  vehicle?: number;
  notes?: string;
  [key: string]: unknown;
};

export type OpeningHours = {
  open?: string;
  close?: string;
  days?: string[];
  notes?: string;
  [key: string]: unknown;
};

export type Destination = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  city: string | null;
  cover_image: string | null;
  panorama_url: string | null;
  lat: number | null;
  lng: number | null;
  ticket_info: TicketInfo | null;
  opening_hours: OpeningHours | null;
  facilities: string[];
  created_at: string;
  updated_at: string;
};

export type RouteStatus = "draft" | "published";

export type Route = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  duration_days: number;
  cover_image: string | null;
  status: RouteStatus;
  created_at: string;
  updated_at: string;
};

export type RouteItem = {
  id: string;
  route_id: string;
  destination_id: string;
  order_index: number;
  time_schedule: string | null;
  notes: string | null;
  created_at: string;
  destination?: Destination | null;
};

export type RouteWithItems = Route & {
  route_items: RouteItem[];
};

export type FilterOption = {
  value: string;
  count: number;
};

export type DestinationFilters = {
  q?: string;
  category?: string;
  city?: string;
};
