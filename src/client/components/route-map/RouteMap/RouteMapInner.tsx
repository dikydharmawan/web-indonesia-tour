"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useI18n } from "@/client/i18n";
import type { RouteMapProps } from "../types";

const DEFAULT_CENTER: [number, number] = [-2.5489, 118.0149];
const ROUTE_COLOR = "#0d9488";
const ACTIVE_COLOR = "#f59e0b";

function createMarkerIcon(label: number, active: boolean) {
  const size = active ? 34 : 28;
  const background = active ? ACTIVE_COLOR : ROUTE_COLOR;

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${background};color:#fff;font-weight:600;font-size:${
      active ? 14 : 12
    }px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 6px rgba(15,23,42,.45)">${label}</div>`,
  });
}

function MapController({
  points,
  selectedId,
  selectedPosition,
  padding,
}: {
  points: [number, number][];
  selectedId: string;
  selectedPosition: [number, number] | null;
  padding: number;
}) {
  const map = useMap();
  const fitKey = JSON.stringify(points);
  const selectedPosKey = selectedPosition ? JSON.stringify(selectedPosition) : "";

  useEffect(() => {
    const coords = JSON.parse(fitKey) as [number, number][];
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView(coords[0], Math.max(map.getZoom(), 12), { animate: false });
      return;
    }
    map.fitBounds(L.latLngBounds(coords), {
      padding: [padding, padding],
      maxZoom: 14,
    });
  }, [map, fitKey, padding]);

  useEffect(() => {
    if (!selectedId || !selectedPosKey) return;
    const position = JSON.parse(selectedPosKey) as [number, number];
    map.flyTo(position, Math.max(map.getZoom(), 13), { duration: 0.8 });
  }, [map, selectedId, selectedPosKey]);

  return null;
}

export default function RouteMapInner({
  waypoints,
  center = DEFAULT_CENTER,
  zoom = 5,
  showPolyline = true,
  scrollWheelZoom = false,
  fitBoundsPadding = 48,
  selectedId = null,
  onWaypointClick,
  emptyText,
}: RouteMapProps) {
  const { dict } = useI18n();
  const ordered = useMemo(
    () =>
      [...waypoints].sort(
        (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
      ),
    [waypoints],
  );

  const positions = useMemo<[number, number][]>(
    () => ordered.map((w) => [w.lat, w.lng]),
    [ordered],
  );

  const icons = useMemo(() => {
    const result = new Map<string, L.DivIcon>();
    ordered.forEach((waypoint, index) => {
      result.set(
        waypoint.id,
        createMarkerIcon(index + 1, waypoint.id === selectedId),
      );
    });
    return result;
  }, [ordered, selectedId]);

  const selected = selectedId
    ? ordered.find((w) => w.id === selectedId) ?? null
    : null;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showPolyline && positions.length > 1 && (
        <Polyline
          positions={positions}
          pathOptions={{
            color: ROUTE_COLOR,
            weight: 4,
            opacity: 0.85,
            dashArray: "10 8",
          }}
        />
      )}

      {ordered.map((waypoint, index) => (
        <Marker
          key={waypoint.id}
          position={[waypoint.lat, waypoint.lng]}
          icon={icons.get(waypoint.id)}
          eventHandlers={{ click: () => onWaypointClick?.(waypoint) }}
        >
          <Popup>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                {index + 1}. {waypoint.title}
              </p>
              {waypoint.timeSchedule && (
                <p className="text-xs font-medium text-brand-700">
                  {waypoint.timeSchedule}
                </p>
              )}
              {waypoint.notes && (
                <p className="text-xs text-slate-600">{waypoint.notes}</p>
              )}
              {waypoint.href && (
                <Link
                  href={waypoint.href}
                  className="inline-block text-xs font-medium text-brand-700 hover:underline"
                >
                  {dict.map.details}
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      <MapController
        points={positions}
        selectedId={selectedId ?? ""}
        selectedPosition={selected ? [selected.lat, selected.lng] : null}
        padding={fitBoundsPadding}
      />

      {ordered.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center bg-slate-100/70 p-6 text-center text-sm text-slate-500">
          {emptyText ?? dict.map.empty}
        </div>
      )}
    </MapContainer>
  );
}
