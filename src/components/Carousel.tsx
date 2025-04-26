import { useRef, useEffect, useState } from "react";

interface CarouselProps {
  images: { src: string; title: string; rating: number }[];
  transitionDuration?: number; // in ms
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  transitionDuration = 500,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(1); // default 1 untuk mobile
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxIndex = images.length - visibleSlides;

  // Handle responsive visibleSlides
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setVisibleSlides(3); // md ke atas: 4 slides
      } else {
        setVisibleSlides(1); // mobile: 1 slide
      }
    };

    handleResize(); // Set awal
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide
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

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "140px" }}
    >
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
      {/* Uncomment kalau mau pakai dots */}
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
