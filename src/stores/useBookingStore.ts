import { create } from "zustand";
import { Film } from "@/services/filmService";

interface BookingData {
  film: Film | null;
  showtimeId: number | null;
  showtimeTime: string | null; // Waktu yang dipilih (misal "2025-04-15 15:30:00")
}

interface BookingStore {
  booking: BookingData;
  setBooking: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  booking: {
    film: null,
    showtimeId: null,
    showtimeTime: null,
  },
  setBooking: (data) =>
    set((state) => ({
      booking: { ...state.booking, ...data },
    })),
  resetBooking: () =>
    set({
      booking: {
        film: null,
        showtimeId: null,
        showtimeTime: null,
      },
    }),
}));
