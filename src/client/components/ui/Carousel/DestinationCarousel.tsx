"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Dictionary } from "@/shared/i18n-dictionaries";
import DestinationCard from "@/client/components/destinations/DestinationCard";
import type { Destination } from "@/types/db";

export default function DestinationCarousel({
  destinations,
  dict,
}: {
  destinations: Destination[];
  dict: Dictionary;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive: Show 1 on mobile, 2 on tablet, 4 on desktop
  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, destinations.length - itemsPerView.desktop + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative mt-10 w-full">
      <div className="relative overflow-hidden w-full">
        {/* Buttons */}
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg border border-slate-200 disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {/* Carousel Track */}
        <div 
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)` }}
        >
            {destinations.map((destination, index) => (
                <div key={destination.id} className="min-w-[25%] flex flex-shrink-0 px-3">
                    <DestinationCard destination={destination} dict={dict} priority={index === 0} />
                </div>
            ))}
        </div>

        <button
          onClick={next}
          disabled={currentIndex >= destinations.length - itemsPerView.desktop}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg border border-slate-200 disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
