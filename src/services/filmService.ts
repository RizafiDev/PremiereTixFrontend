import axios from "axios";

const API_FILMS_URL = "http://127.0.0.1:8000/api/dashboard/films";
const API_GENRES_URL = "http://127.0.0.1:8000/api/dashboard/genres";
const IMAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

export interface Genre {
  id: number;
  genre: string;
  color: string;
}

export interface Film {
  id: number;
  title: string;
  description: string;
  release_date: string;
  rating: string;
  country: string;
  photo: string;
  playing: number;
  genres: Genre[];
}

const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get<{ data: Genre[] }>(API_GENRES_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const getFilms = async (): Promise<Film[]> => {
  try {
    const [genresResponse, filmsResponse] = await Promise.all([
      getGenres(),
      axios.get<{ data: Film[] }>(API_FILMS_URL),
    ]);

    const genresMap = genresResponse.reduce((acc, genre) => {
      acc[genre.id] = genre;
      return acc;
    }, {} as Record<number, Genre>);

    return filmsResponse.data.data.map((film) => ({
      ...film,
      photo: IMAGE_BASE_URL + film.photo,
      genres: film.genres.map((genre) => ({
        id: genre.id,
        genre: genresMap[genre.id]?.genre || "Unknown",
        color: genresMap[genre.id]?.color || "#000000",
      })),
    }));
  } catch (error) {
    console.error("Error fetching films:", error);
    throw error;
  }
};
