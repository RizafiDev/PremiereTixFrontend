import { useEffect, useState, useCallback } from "react";
import { getFilms, Film } from "@/services/filmService";
import { useNavigate } from "react-router-dom";

const FilmCatalog = ({ slideDuration = 5000, transitionDuration = 500 }) => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // Number of films to display per slide
  const filmsPerSlide = 5;

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const data = await getFilms();
        setFilms(data);
      } catch {
        setError("Gagal mengambil data film");
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
  }, []);

  const nextSlide = useCallback(() => {
    if (films.length <= filmsPerSlide) return; // Don't animate if we have 5 or fewer films

    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % (films.length - (filmsPerSlide - 1))
      );
      setIsAnimating(false);
    }, transitionDuration);
  }, [films.length, transitionDuration]);

  useEffect(() => {
    if (films.length <= filmsPerSlide) return; // Don't set up carousel if we have 5 or fewer films

    const interval = setInterval(nextSlide, slideDuration);
    return () => clearInterval(interval);
  }, [films.length, slideDuration, nextSlide]);

  const handleBuyTicket = (film: Film) => {
    const token = localStorage.getItem("token");
    navigate(token ? "/buy" : "/login", { state: { film } });
  };

  const manualNavigate = (direction: "prev" | "next") => {
    if (isAnimating || films.length <= filmsPerSlide) return;

    setIsAnimating(true);

    setTimeout(() => {
      if (direction === "prev") {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? films.length - filmsPerSlide : prevIndex - 1
        );
      } else {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % (films.length - (filmsPerSlide - 1))
        );
      }
      setIsAnimating(false);
    }, transitionDuration);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (films.length === 0) return <p>Tidak ada film tersedia</p>;

  // Display logic for films
  const displayFilms =
    films.length <= filmsPerSlide
      ? films
      : films.slice(currentIndex, currentIndex + filmsPerSlide).length ===
        filmsPerSlide
      ? films.slice(currentIndex, currentIndex + filmsPerSlide)
      : [
          ...films.slice(currentIndex),
          ...films.slice(0, filmsPerSlide - (films.length - currentIndex)),
        ];

  return (
    <div className="w-full  relative">
      {films.length > filmsPerSlide && (
        <>
          <button
            onClick={() => manualNavigate("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-r-lg hover:bg-black/70"
            disabled={isAnimating}
          >
            &#10094;
          </button>
          <button
            onClick={() => manualNavigate("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-l-lg hover:bg-black/70"
            disabled={isAnimating}
          >
            &#10095;
          </button>
        </>
      )}

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 transition-all duration-500"
        style={{
          transitionDuration: `${transitionDuration}ms`,
          opacity: isAnimating ? 0.7 : 1,
          transform: isAnimating ? "scale(0.98)" : "scale(1)",
        }}
      >
        {displayFilms.map((film) => (
          <div
            key={film.id}
            className="aspect-[2/3] rounded-xl overflow-hidden group relative shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={film.photo}
              alt={film.title}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
            {/* Title */}
            <div className="absolute bottom-16 left-0 w-full text-center text-bold text-xl text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {film.title}
            </div>
            {/* Buy button */}
            <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => handleBuyTicket(film)}
                className="w-full bg-textsecondary text-white py-3 text-sm font-bold transition cursor-pointer"
              >
                Beli Tiket
              </button>
            </div>
          </div>
        ))}
      </div>

      {films.length > filmsPerSlide && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: films.length - (filmsPerSlide - 1) }).map(
            (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === index ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default FilmCatalog;
