import { useRef, useEffect, useState } from "react";

interface CarouselProps {
  images: { src: string; title: string; rating: number }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Auto-slide setiap 3 detik

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  useEffect(() => {
    setTranslateX(-activeIndex * 100);
  }, [activeIndex]);

  return (
    <div className="relative w-full aspect-[320/123] overflow-hidden">
      {/* Container Carousel */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${translateX}%)` }} // Perubahan slide
      >
        {images.map((image, index) => (
          <div key={index} className="flex-none w-full h-full">
            <img
              src={image.src}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indikator Titik */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
