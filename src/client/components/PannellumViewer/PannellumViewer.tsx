"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useI18n } from "@/client/i18n";
import "pannellum/build/pannellum.css";

export type TourHotspot = {
  id?: string;
  /** Derajat. Negatif = ke bawah. */
  pitch: number;
  /** Derajat [-180, 180]. */
  yaw: number;
  /** "info" = tooltip/tautan, "scene" = pindah ke panorama lain (butuh scenes). */
  type?: "info" | "scene";
  text?: string;
  /** Untuk type "info": URL tujuan (dibuka di tab baru). */
  url?: string;
  /** Untuk type "scene": id scene tujuan. */
  sceneId?: string;
  cssClass?: string;
};

export type TourScene = {
  id: string;
  /** URL foto panorama equirectangular 360 derajat. */
  panorama: string;
  title?: string;
  pitch?: number;
  yaw?: number;
  hfov?: number;
  hotspots?: TourHotspot[];
};

export type PannellumViewerProps = {
  /** URL panorama equirectangular (mode single scene). */
  src?: string;
  /** Mode tour multi-scene — jika diisi, diprioritaskan di atas `src`. */
  scenes?: TourScene[];
  /** Hotspot untuk mode single scene. */
  hotspots?: TourHotspot[];
  height?: string;
  className?: string;
  autoLoad?: boolean;
  /** Derajat per detik. Negatif = putar ke kanan. */
  autoRotate?: number;
  compass?: boolean;
  showControls?: boolean;
  showZoomCtrl?: boolean;
  showFullscreenCtrl?: boolean;
  /** Gambar poster yang tampil sebelum panorama dimuat. */
  preview?: string;
  pitch?: number;
  yaw?: number;
  hfov?: number;
  loadingText?: string;
  errorText?: string;
  /** Dipanggil setelah viewer Pannellum siap (untuk lookAt, addHotSpot, dll). */
  onReady?: (viewer: Pannellum.Viewer) => void;
  onLoad?: () => void;
  onSceneChange?: (sceneId: string) => void;
  onError?: (message: string) => void;
};

type Status = "loading" | "ready" | "error";

type ResolvedConfig = Pick<
  PannellumViewerProps,
  | "src"
  | "scenes"
  | "hotspots"
  | "autoLoad"
  | "autoRotate"
  | "compass"
  | "showControls"
  | "showZoomCtrl"
  | "showFullscreenCtrl"
  | "preview"
  | "pitch"
  | "yaw"
  | "hfov"
  | "loadingText"
>;

function toPannellumHotspots(list?: TourHotspot[]): Pannellum.HotspotOptions[] {
  return (list ?? []).map((h) => ({
    id: h.id,
    pitch: h.pitch,
    yaw: h.yaw,
    type: h.type ?? "info",
    text: h.text,
    URL: h.url,
    sceneId: h.sceneId,
    cssClass: h.cssClass,
  }));
}

export default function PannellumViewer({
  src,
  scenes,
  hotspots,
  height = "480px",
  className = "",
  autoLoad = true,
  autoRotate,
  compass = false,
  showControls = true,
  showZoomCtrl = true,
  showFullscreenCtrl = true,
  preview,
  pitch = 0,
  yaw = 0,
  hfov = 100,
  loadingText,
  errorText,
  onReady,
  onLoad,
  onSceneChange,
  onError,
}: PannellumViewerProps) {
  const { dict } = useI18n();
  const resolvedLoadingText = loadingText ?? dict.pannellum.loading;
  const resolvedErrorText = errorText ?? dict.pannellum.error;
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Pannellum.Viewer | null>(null);
  const [state, setState] = useState<{
    key: string;
    status: Status;
    message: string | null;
  }>({ key: "", status: "loading", message: null });

  const callbacksRef = useRef({ onReady, onLoad, onSceneChange, onError });
  useEffect(() => {
    callbacksRef.current = { onReady, onLoad, onSceneChange, onError };
  });

  const configKey = useMemo(
    () =>
      JSON.stringify({
        src,
        scenes,
        hotspots,
        autoLoad,
        autoRotate,
        compass,
        showControls,
        showZoomCtrl,
        showFullscreenCtrl,
        preview,
        pitch,
        yaw,
        hfov,
        loadingText: resolvedLoadingText,
      } satisfies ResolvedConfig),
    [
      src,
      scenes,
      hotspots,
      autoLoad,
      autoRotate,
      compass,
      showControls,
      showZoomCtrl,
      showFullscreenCtrl,
      preview,
      pitch,
      yaw,
      hfov,
      resolvedLoadingText,
    ],
  );

  useEffect(() => {
    const cfg = JSON.parse(configKey) as ResolvedConfig;
    const el = containerRef.current;

    if (!el) return;

    const hasScenes = (cfg.scenes?.length ?? 0) > 0;
    if (!hasScenes && !cfg.src) return;

    let disposed = false;
    let viewer: Pannellum.Viewer | null = null;

    const update = (status: Status, message: string | null) => {
      if (!disposed) setState({ key: configKey, status, message });
    };

    void (async () => {
      try {
        // Pannellum tidak aman untuk SSR — muat hanya di browser.
        await import("pannellum");
        if (disposed || !containerRef.current) return;

        const shared: Pannellum.ConfigOptions = {
          autoLoad: cfg.autoLoad,
          autoRotate: cfg.autoRotate,
          compass: cfg.compass,
          showControls: cfg.showControls,
          showZoomCtrl: cfg.showZoomCtrl,
          showFullscreenCtrl: cfg.showFullscreenCtrl,
          preview: cfg.preview,
          pitch: cfg.pitch,
          yaw: cfg.yaw,
          hfov: cfg.hfov,
          escapeHTML: true,
          strings: {
            loadButtonLabel: dict.pannellum.load,
            loadingLabel: cfg.loadingText,
          },
        };

        let config: Pannellum.ConfigOptions | Pannellum.TourOptions;

        if (hasScenes && cfg.scenes) {
          const scenesMap: Record<string, Pannellum.ConfigOptions> = {};
          for (const scene of cfg.scenes) {
            scenesMap[scene.id] = {
              ...shared,
              type: "equirectangular",
              panorama: scene.panorama,
              title: scene.title,
              pitch: scene.pitch ?? cfg.pitch,
              yaw: scene.yaw ?? cfg.yaw,
              hfov: scene.hfov ?? cfg.hfov,
              hotSpots: toPannellumHotspots(scene.hotspots),
            };
          }
          config = {
            default: { ...shared, firstScene: cfg.scenes[0].id, sceneFadeDuration: 600 },
            scenes: scenesMap,
          };
        } else {
          config = {
            ...shared,
            type: "equirectangular",
            panorama: cfg.src ?? "",
            hotSpots: toPannellumHotspots(cfg.hotspots),
          };
        }

        viewer = window.pannellum.viewer(containerRef.current, config);
        viewerRef.current = viewer;

        viewer.on("load", () => {
          if (disposed) return;
          update("ready", null);
          callbacksRef.current.onLoad?.();
        });

        viewer.on("scenechange", (sceneId) => {
          callbacksRef.current.onSceneChange?.(sceneId);
        });

        viewer.on("error", (errorMsg) => {
          if (disposed) return;
          callbacksRef.current.onError?.(errorMsg);
          setState((prev) =>
            prev.key === configKey && prev.status === "ready"
              ? prev
              : { key: configKey, status: "error", message: errorMsg },
          );
        });

        if (!cfg.autoLoad) update("ready", null);
        callbacksRef.current.onReady?.(viewer);
      } catch (err) {
        if (disposed) return;
        const msg = err instanceof Error ? err.message : String(err);
        update("error", msg);
        callbacksRef.current.onError?.(msg);
      }
    })();

    return () => {
      disposed = true;
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [configKey, dict.pannellum.load]);

  const hasSource = (scenes?.length ?? 0) > 0 || Boolean(src);
  const status: Status = !hasSource
    ? "error"
    : state.key === configKey
      ? state.status
      : "loading";
  const message = !hasSource
    ? dict.pannellum.empty
    : state.key === configKey
      ? state.message
      : null;

  return (
    <div
      className={`relative overflow-hidden bg-slate-950 ${className}`}
      style={{ height }}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950/70 px-6 text-center text-slate-100 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" aria-hidden />
          <p className="text-sm">{resolvedLoadingText}</p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950/85 px-6 text-center text-slate-100">
          <AlertTriangle className="h-8 w-8 text-amber-400" aria-hidden />
          <p className="max-w-md text-sm text-slate-300">
            {message ?? resolvedErrorText}
          </p>
        </div>
      )}
    </div>
  );
}
