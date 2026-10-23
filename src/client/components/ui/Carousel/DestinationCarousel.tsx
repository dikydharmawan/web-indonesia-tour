"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Dictionary } from "@/shared/i18n-dictionaries";
import DestinationCard from "@/client/components/destinations/DestinationCard";
import type { Destination } from "@/types/db";

function getPerView() {
  if (typeof window === "undefined") return 4;
  if (window.matchMedia("(min-width: 1024px)").matches) return 4;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

export default function DestinationCarousel({
  destinations,
  dict,
}: {
  destinations: Destination[];
  dict: Dictionary;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const update = () => setPerView(getPerView());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, destinations.length - perView);
  const index = Math.min(currentIndex, maxIndex);

  const next = () => setCurrentIndex(Math.min(index + 1, maxIndex));

  const prev = () => setCurrentIndex(Math.max(index - 1, 0));

  return (
    <div className="relative mt-10 w-full">
      <div className="relative w-full overflow-hidden">
        <button
          onClick={prev}
          disabled={index === 0}
          aria-label={dict.common.previous}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-lg disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
        </button>

        <div
          className="flex items-stretch transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / perView)}%)`,
          }}
        >
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="shrink-0 px-2 sm:px-3"
              style={{ width: `${100 / perView}%` }}
            >
              <DestinationCard
                destination={destination}
                dict={dict}
                priority={index < perView}
              />
            </div>
          ))}
        </div>

        <button
          onClick={next}
          disabled={index >= maxIndex}
          aria-label={dict.common.next}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-lg disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
