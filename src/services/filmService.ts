import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/dashboard/films";
const IMAGE_BASE_URL = "http://127.0.0.1:8000/storage/images/"; // Sesuaikan dengan lokasi penyimpanan gambar

export interface Genre {
  id: number;
  name: string | null;
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

export const getFilms = async (): Promise<Film[]> => {
  try {
    const response = await axios.get<{ data: Film[] }>(API_URL);
    return response.data.data.map((film) => ({
      ...film,
      photo: IMAGE_BASE_URL + film.photo, // Format path gambar
    }));
  } catch (error) {
    console.error("Error fetching films:", error);
    throw error;
  }
};
