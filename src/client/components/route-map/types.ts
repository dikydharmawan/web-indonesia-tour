export type RouteWaypoint = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  /** Urutan kunjungan. Waypoint diurutkan naik berdasarkan nilai ini. */
  orderIndex?: number | null;
  /** Contoh: "Hari 1 - 09:00". */
  timeSchedule?: string | null;
  notes?: string | null;
  category?: string | null;
  /** Link ke halaman detail destinasi, contoh: "/destinasi/candi-borobudur". */
  href?: string;
};

export type RouteMapProps = {
  waypoints: RouteWaypoint[];
  /** CSS height container. Default "440px". */
  height?: string;
  className?: string;
  center?: [number, number];
  zoom?: number;
  showPolyline?: boolean;
  scrollWheelZoom?: boolean;
  fitBoundsPadding?: number;
  /** Id waypoint yang di-highlight + di-fly-to. */
  selectedId?: string | null;
  onWaypointClick?: (waypoint: RouteWaypoint) => void;
  emptyText?: string;
};
