import { useEffect, useState } from "react";
import { getFilms, Film } from "@/services/filmService";
import { TicketIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const FilmList = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false); // State untuk transisi
  const navigate = useNavigate();

  const handleBuyTicket = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chair");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const data = await getFilms();
        setFilms(data);
      } catch (err) {
        setError("Gagal mengambil data film");
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const handleNext = () => {
    setIsTransitioning(true); // Mulai transisi
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % films.length);
      setIsTransitioning(false); // Selesaikan transisi
    }, 350); // Durasi transisi (200ms)
  };

  const handleFilmClick = (index: number) => {
    setIsTransitioning(true); // Mulai transisi
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false); // Selesaikan transisi
    }, 350); // Durasi transisi (200ms)
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-start w-full">
      {/* Carousel Container */}
      <div className="relative w-full">
        {/* Active Film (Large Image and Info) */}
        <div
          className={`flex gap-8 items-start mb-8 transition-opacity duration-200 ${
            isTransitioning ? "opacity-0 blur-xs" : "opacity-100 blur-0"
          }`}
        >
          <img
            src={films[activeIndex]?.photo}
            alt={films[activeIndex]?.title}
            className="aspect-[2/3] w-80 rounded-3xl shadow-sm"
          />
          <div className="flex-1">
            <h3 className="text-4xl font-bold mb-2">
              {films[activeIndex]?.title}
            </h3>
            <p className="text-gray-700 mb-4 font-medium max-w-[800px]">
              {films[activeIndex]?.description}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Rilis:</strong>{" "}
              {new Date(films[activeIndex]?.release_date).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}{" "}
              | <strong>Negara:</strong> {films[activeIndex]?.country}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Rating:</strong> {films[activeIndex]?.rating}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Genres:</strong>{" "}
              {films[activeIndex]?.genres.map((g, i) => (
                <span key={g.id} style={{ color: g.color }} className="mr-2">
                  {g.genre ? g.genre : `Genre ${i + 1}`}
                </span>
              ))}
            </p>
            <button
              onClick={handleBuyTicket}
              className="text-lg font-semibold flex gap-2 items-center py-3.5 px-8 mt-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              <TicketIcon className="w-6" />
              Buy Ticket
            </button>
          </div>
        </div>

        {/* Film Queue (Small Images) */}
        <div className="flex gap-4 py-4 absolute bottom-4 left-80 ml-8">
          {films.map((film, index) => (
            <img
              key={film.id}
              src={film.photo}
              alt={film.title}
              className={`aspect-[2/3] w-32 rounded-xl cursor-pointer transition-transform ${
                index === activeIndex ? "scale-110" : "opacity-75"
              }`}
              onClick={() => handleFilmClick(index)}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FilmList;
