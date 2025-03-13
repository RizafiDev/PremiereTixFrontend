import { useRef, useEffect, useState } from "react";

interface CarouselProps {
  images: { src: string; title: string; description: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = (activeIndex + 1) % images.length;
        setActiveIndex(nextIndex);
        const nextSlide = carouselRef.current.children[nextIndex] as HTMLElement;
        nextSlide?.scrollIntoView({ behavior: "smooth" });
      }
    }, 3000); // Ganti slide setiap 3 detik

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Container */}
      <div ref={carouselRef} className="flex w-full overflow-hidden">
        {images.map((image, index) => (
          <div key={index} className="relative flex-none w-full">
            {/* Gambar */}
            <img src={image.src} alt={`Slide ${index}`} className="w-full h-[500px] object-cover" />
            
            {/* Layer Informasi */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white transition-opacity duration-500">
              <h2 className="text-2xl font-bold">{image.title}</h2>
              <p className="text-sm">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indikator Titik */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
