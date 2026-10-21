"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MousePointer2,
  Pause,
  Play,
} from "lucide-react";
import PannellumViewer from "@/client/components/PannellumViewer";
import Badge from "@/client/components/ui/Badge";
import { useI18n } from "@/client/i18n";
import { interpolate } from "@/shared/i18n-config";
import { cn } from "@/shared/utils";

type HeroItem = {
  title: string;
  location: string | null;
  panorama: string | null;
  preview?: string | null;
};

type HeroProps = {
  items?: HeroItem[];
  title?: string;
  location?: string | null;
  panorama?: string | null;
  preview?: string | null;
};

export default function Hero(props: HeroProps) {
  const { dict } = useI18n();
  const [autoRotate, setAutoRotate] = useState(true);
  const [index, setIndex] = useState(0);

  const items: HeroItem[] =
    props.items && props.items.length > 0
      ? props.items
      : [
          {
            title: props.title ?? "Kawah Ijen",
            location: props.location ?? "Banyuwangi",
            panorama: props.panorama ?? "/media/panoramas/borobudur.jpg",
            preview: props.preview ?? "/media/covers/borobudur.jpg",
          },
        ];

  const active = items[index] ?? items[0];
  const title = active.title;
  const location = active.location ?? "Banyuwangi";
  const panorama = active.panorama ?? "/media/panoramas/borobudur.jpg";
  const preview = active.preview ?? undefined;

  useEffect(() => {
    if (!autoRotate || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [autoRotate, items.length]);

  const goTo = (next: number) => {
    if (items.length <= 1) return;
    setIndex((next + items.length) % items.length);
  };

  return (
    <section className="relative isolate h-[76vh] min-h-[580px] max-h-[820px] w-full overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <PannellumViewer
          key={panorama}
          src={panorama}
          preview={preview}
          height="100%"
          autoRotate={autoRotate ? 1.6 : undefined}
          compass
          yaw={20}
          pitch={2}
          hfov={105}
          loadingText={dict.hero.loading}
          className="h-full w-full"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink-950/60 via-transparent to-transparent sm:w-3/4"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="pointer-events-none max-w-2xl animate-float-in">
            <Badge variant="outline" className="mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-300" />
              </span>
              {interpolate(dict.hero.badge, { location })}
            </Badge>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {dict.hero.titleLine1}
              <span className="block text-brand-200">
                {dict.hero.titleLine2}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {interpolate(dict.hero.description, { title })}
            </p>
            <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/destinasi"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900 shadow-lg transition hover:bg-brand-50"
              >
                {dict.hero.explore}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link
                href="/rute"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                {dict.hero.viewRoutes}
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-xs font-medium text-white/60">
              <MousePointer2 className="h-3.5 w-3.5" aria-hidden />
              {dict.hero.dragHint}
            </p>
            <div className="flex items-center gap-2">
              {items.length > 1 && (
                <div className="pointer-events-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAutoRotate(false);
                      goTo(index - 1);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-ink-950/40 text-white backdrop-blur transition hover:bg-ink-950/60"
                    aria-label="Previous destination"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoRotate(false);
                      goTo(index + 1);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-ink-950/40 text-white backdrop-blur transition hover:bg-ink-950/60"
                    aria-label="Next destination"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                  <div className="ml-1 flex items-center gap-1.5">
                    {items.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setAutoRotate(false);
                          goTo(i);
                        }}
                        className={cn(
                          "h-1.5 rounded-full transition",
                          i === index
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/40 hover:bg-white/70",
                        )}
                        aria-label={`Go to ${item.title}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setAutoRotate((value) => !value)}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-ink-950/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-ink-950/60"
                aria-pressed={autoRotate}
              >
                {autoRotate ? (
                  <Pause className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Play className="h-3.5 w-3.5" aria-hidden />
                )}
                {autoRotate ? dict.hero.pause : dict.hero.autoRotate}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
