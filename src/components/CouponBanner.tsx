import { useEffect, useRef, useState } from "react";
import { ArrowRightCircleIcon as SemuaIcon } from "@heroicons/react/24/outline";
import { ChevronLeft, ChevronRight } from "lucide-react";

import promo1 from "../../public/coupon/promo1.jpg";
import promo2 from "../../public/coupon/promo2.jpg";
import promo3 from "../../public/coupon/promo3.jpg";
import promo4 from "../../public/coupon/promo4.jpg";
import promo5 from "../../public/coupon/promo5.jpg";
import promo6 from "../../public/coupon/promo6.jpg";
import promo7 from "../../public/coupon/promo7.jpg";
import promo8 from "../../public/coupon/promo8.jpg";
import promo9 from "../../public/coupon/promo9.jpg";

// Define the type for image imports
type ImageImport = string;

const promoImages: ImageImport[] = [
  promo1,
  promo2,
  promo3,
  promo4,
  promo5,
  promo6,
  promo7,
  promo8,
  promo9,
];

const ITEMS_PER_VIEW = 3;
const SCROLL_INTERVAL = 4000; // ms
const TRANSITION_DURATION = 500; // ms

function CouponBanner(): React.ReactElement {
  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calculate how many complete groups we have
  const totalGroups = Math.ceil(promoImages.length / ITEMS_PER_VIEW);

  // Group promos into slides of 3
  const groupedImages: ImageImport[][] = [];
  for (let i = 0; i < promoImages.length; i += ITEMS_PER_VIEW) {
    groupedImages.push(promoImages.slice(i, i + ITEMS_PER_VIEW));
  }

  // Auto scroll
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentGroup((prev) => (prev + 1) % totalGroups);
    }, SCROLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [totalGroups]);

  // Apply transition when current group changes
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.transition = `transform ${TRANSITION_DURATION}ms ease-in-out`;
      container.style.transform = `translateX(-${currentGroup * 100}%)`;
    }
  }, [currentGroup]);

  const goToPrev = (): void => {
    // Reset the auto-scroll interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCurrentGroup((prev) => (prev - 1 + totalGroups) % totalGroups);

    // Restart interval
    intervalRef.current = setInterval(() => {
      setCurrentGroup((prev) => (prev + 1) % totalGroups);
    }, SCROLL_INTERVAL);
  };

  const goToNext = (): void => {
    // Reset the auto-scroll interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCurrentGroup((prev) => (prev + 1) % totalGroups);

    // Restart interval
    intervalRef.current = setInterval(() => {
      setCurrentGroup((prev) => (prev + 1) % totalGroups);
    }, SCROLL_INTERVAL);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-48 w-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mau pake promo?</h1>
        <button className="text-sm font-medium text-gray-600 flex items-center gap-1">
          Semua <SemuaIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        {/* Left navigation arrow */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right navigation arrow */}
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
        >
          <ChevronRight size={20} />
        </button>

        {/* Carousel track */}
        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex"
            style={{ width: `${totalGroups * 100}%` }}
          >
            {groupedImages.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="w-full"
                style={{ flex: `0 0 ${100 / totalGroups}%` }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-1">
                  {group.map((img, imgIdx) => (
                    <img
                      key={`${groupIdx}-${imgIdx}`}
                      src={img}
                      className="rounded-xl w-full aspect-[3/1] object-cover shadow"
                      alt={`promo-${groupIdx * ITEMS_PER_VIEW + imgIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalGroups }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentGroup(idx)}
              className={`w-2 h-2 rounded-full ${
                currentGroup === idx ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to slide group ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CouponBanner;
