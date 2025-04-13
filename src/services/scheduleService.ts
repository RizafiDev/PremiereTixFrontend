import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/dashboard";
const IMAGE_BASE_URL = "http://127.0.0.1:8000/storage/";

const FILMS_URL = `${API_BASE_URL}/films`;
const CINEMAS_URL = `${API_BASE_URL}/cinemas`;
const SCHEDULES_URL = `${API_BASE_URL}/schedules`;
const SEATS_URL = `${API_BASE_URL}/seats`;

export interface Film {
  id: number;
  title: string;
  description: string;
  release_date: string;
  rating: string;
  country: string;
  photo: string;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  province: string;
  city: string;
}

export interface Schedule {
  id: number;
  film_id: number;
  cinema_id: number;
  show_time: string;
  studio: string;
  film?: Film;
  cinema?: Cinema;
}

export interface Seat {
  id: number;
  schedule_id: number;
  seat_code: string;
  is_booked: boolean;
  booked_by?: string;
}

/**
 * Ambil semua data film
 */
const fetchFilms = async (): Promise<Film[]> => {
  const response = await axios.get<{ data: Film[] }>(FILMS_URL);
  return response.data.data.map((film) => ({
    ...film,
    photo: IMAGE_BASE_URL + film.photo,
  }));
};

/**
 * Ambil semua data cinema
 */
const fetchCinemas = async (): Promise<Cinema[]> => {
  const response = await axios.get<{ data: Cinema[] }>(CINEMAS_URL);
  return response.data.data;
};

/**
 * Ambil semua jadwal tayang dan hubungkan dengan data film & bioskop
 */
export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    const [schedulesRes, films, cinemas] = await Promise.all([
      axios.get<{ data: Schedule[] }>(SCHEDULES_URL),
      fetchFilms(),
      fetchCinemas(),
    ]);

    const filmMap = new Map<number, Film>(films.map((f) => [f.id, f]));
    const cinemaMap = new Map<number, Cinema>(cinemas.map((c) => [c.id, c]));

    return schedulesRes.data.data.map((schedule) => ({
      ...schedule,
      film: filmMap.get(schedule.film_id),
      cinema: cinemaMap.get(schedule.cinema_id),
    }));
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

/**
 * Ambil semua kursi berdasarkan schedule_id
 */
export const getSeatsBySchedule = async (
  scheduleId: number
): Promise<Seat[]> => {
  try {
    const response = await axios.get<{ data: Seat[] }>(
      `${SEATS_URL}?schedule_id=${scheduleId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching seats:", error);
    throw error;
  }
};
