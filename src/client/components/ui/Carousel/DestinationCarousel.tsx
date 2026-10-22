"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "@/client/components/destinations/DestinationCard";
import type { Destination } from "@/types/db";

export default function DestinationCarousel({ destinations }: { destinations: Destination[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // For simplicity, showing 1 card at a time on mobile, 4 on desktop
  // Need to adjust this for better responsiveness if possible, 
  // but keeping it simple for now.

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  return (
    <div className="relative mt-10">
      <div className="flex items-center justify-between gap-4 overflow-hidden">
        <button
          onClick={prev}
          className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg border border-slate-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex gap-6 w-full px-10">
            {destinations.map((destination, index) => (
                <div key={destination.id} className="min-w-[250px] flex-1">
                    <DestinationCard destination={destination} priority={index === 0} />
                </div>
            ))}
        </div>

        <button
          onClick={next}
          className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg border border-slate-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
