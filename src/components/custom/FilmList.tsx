import { useEffect, useState } from "react";
import { getFilms, Film } from "@/services/filmService";

const FilmList = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Daftar Film</h1>
      <ul>
        {films.map((film) => (
          <li
            key={film.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{film.title}</h3>
            <img
              src={film.photo}
              alt={film.title}
              style={{ width: "200px", height: "auto", borderRadius: "5px" }}
            />
            <p>{film.description}</p>
            <p>
              <strong>Rilis:</strong> {film.release_date} |{" "}
              <strong>Negara:</strong> {film.country}
            </p>
            <p>
              <strong>Rating:</strong> {film.rating}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {film.genres.map((g, i) => (
                <span key={g.id} style={{ color: g.color }}>
                  {g.name ? g.name : `Genre ${i + 1}`}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilmList;
