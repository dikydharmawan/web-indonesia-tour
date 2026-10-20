"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/client/i18n";
import type { RouteMapProps } from "../types";

function MapLoading() {
  const { dict } = useI18n();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-100 text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin text-sky-500" aria-hidden />
      <p className="text-sm">{dict.map.loading}</p>
    </div>
  );
}

// Leaflet mengakses window saat modul dimuat, jadi wajib tanpa SSR.
const RouteMapInner = dynamic(() => import("./RouteMapInner"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default function RouteMap({
  height = "440px",
  className = "",
  ...props
}: RouteMapProps) {
  const { dict } = useI18n();
  return (
    <div
      className={`relative z-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}
      style={{ height }}
    >
      <RouteMapInner emptyText={dict.map.empty} {...props} />
    </div>
  );
}

export type { RouteMapProps, RouteWaypoint } from "../types";
