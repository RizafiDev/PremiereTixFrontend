import axios from "axios";

const API_SCHEDULES_URL = "http://127.0.0.1:8000/api/dashboard/schedules";
const API_SEATS_URL = "http://127.0.0.1:8000/api/dashboard/seats";

export interface Cinema {
  id: number;
  name: string;
  address: string;
}

export interface Schedule {
  id: number;
  film_id: number;
  cinema_id: number;
  show_date: string;
  show_time: string;
  studio: string;
  price: number;
  cinema?: Cinema;
}

export interface Seat {
  id: number;
  schedule_id: number;
  seat_code: string;
  is_booked: boolean;
}

export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await axios.get<{ data: Schedule[] }>(API_SCHEDULES_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const getSchedulesByFilm = async (
  filmId: number
): Promise<Schedule[]> => {
  const allSchedules = await getSchedules();
  return allSchedules.filter((s) => s.film_id === filmId);
};

export const getSeatsBySchedule = async (
  scheduleId: number
): Promise<Seat[]> => {
  try {
    const response = await axios.get(API_SEATS_URL, {
      params: { schedule_id: scheduleId },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching seats:", error);
    throw error;
  }
};

export const isScheduleFull = async (scheduleId: number): Promise<boolean> => {
  const seats = await getSeatsBySchedule(scheduleId);
  return seats.every((seat) => seat.is_booked);
};
