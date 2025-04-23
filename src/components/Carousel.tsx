import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  images: { src: string; title: string; rating: number }[];
  transitionDuration?: number; // in ms
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  transitionDuration = 500,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const visibleSlides = 3;
  const maxIndex = images.length - visibleSlides;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [maxIndex]);

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "140px" }}
    >
      {/* Arrow Buttons */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel Container */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${(100 / images.length) * activeIndex}%)`,
          transition: `transform ${transitionDuration}ms ease-in-out`,
          width: `${(100 / visibleSlides) * images.length}%`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{ width: `${100 / images.length}%` }}
            className="flex-none h-full px-1"
          >
            <img
              src={image.src}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover object-center rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {/* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default Carousel;
