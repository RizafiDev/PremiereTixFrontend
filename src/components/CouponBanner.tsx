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

const promoImages = [
  { src: promo1, title: "Promo 1" },
  { src: promo2, title: "Promo 2" },
  { src: promo3, title: "Promo 3" },
  { src: promo4, title: "Promo 4" },
  { src: promo5, title: "Promo 5" },
  { src: promo6, title: "Promo 6" },
  { src: promo7, title: "Promo 7" },
  { src: promo8, title: "Promo 8" },
  { src: promo9, title: "Promo 9" },
];

const SCROLL_INTERVAL = 4000; // ms
const TRANSITION_DURATION = 500; // ms

function CouponBanner(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateItemsPerView = () => {
    if (window.innerWidth >= 768) {
      setItemsPerView(3);
    } else {
      setItemsPerView(1);
    }
  };

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, promoImages.length - itemsPerView);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, SCROLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [maxIndex]);

  const goToPrev = (): void => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setActiveIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));

    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, SCROLL_INTERVAL);
  };

  const goToNext = (): void => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setActiveIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));

    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, SCROLL_INTERVAL);
  };

  return (
    <div className="container text-textprimary dark:text-white mx-auto px-4 md:px-48 w-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Mau pake promo?</h1>
        <button className="text-sm font-medium text-gray-600 flex items-center gap-1">
          Semua <SemuaIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        {/* Left navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right navigation */}
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
        >
          <ChevronRight size={20} />
        </button>

        {/* Carousel container */}
        <div
          className="flex"
          style={{
            transform: `translateX(-${
              (100 / promoImages.length) * activeIndex
            }%)`,
            transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
            width: `${(100 / itemsPerView) * promoImages.length}%`,
          }}
        >
          {promoImages.map((image, index) => (
            <div
              key={index}
              style={{ width: `${100 / promoImages.length}%` }}
              className="flex-none px-1"
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full aspect-[3/1] object-cover rounded-xl shadow"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CouponBanner;
