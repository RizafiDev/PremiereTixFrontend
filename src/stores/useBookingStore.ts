import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Film } from "@/services/filmService";
import { Cinema } from "@/services/scheduleService";

interface BookingData {
  film: Film | null;
  cinema: Cinema | null;
  showtimeId: number | null;
  showtimeTime: string | null; // Format: "2025-04-15 15:30:00"
  showDate: string | null; // Format: "YYYY-MM-DD"
  studio: string | null;
  price: number | null;
  selectedSeats: string[];
  totalPrice: number;
}

interface BookingStore {
  booking: BookingData;
  setBooking: (data: Partial<BookingData>) => void;
  setSelectedSeats: (seats: string[]) => void;
  addSeat: (seat: string) => void;
  removeSeat: (seat: string) => void;
  calculateTotal: () => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      booking: {
        film: null,
        cinema: null,
        showtimeId: null,
        showtimeTime: null,
        showDate: null,
        studio: null,
        price: null,
        selectedSeats: [],
        totalPrice: 0,
      },
      setBooking: (data) =>
        set((state) => ({
          booking: { ...state.booking, ...data },
        })),
      setSelectedSeats: (seats) =>
        set((state) => {
          const booking = {
            ...state.booking,
            selectedSeats: seats,
            totalPrice: seats.length * (state.booking.price || 0),
          };
          return { booking };
        }),
      addSeat: (seat) =>
        set((state) => {
          if (state.booking.selectedSeats.includes(seat)) {
            return state;
          }

          const selectedSeats = [...state.booking.selectedSeats, seat];
          const totalPrice = selectedSeats.length * (state.booking.price || 0);

          return {
            booking: {
              ...state.booking,
              selectedSeats,
              totalPrice,
            },
          };
        }),
      removeSeat: (seat) =>
        set((state) => {
          const selectedSeats = state.booking.selectedSeats.filter(
            (s) => s !== seat
          );
          const totalPrice = selectedSeats.length * (state.booking.price || 0);

          return {
            booking: {
              ...state.booking,
              selectedSeats,
              totalPrice,
            },
          };
        }),
      calculateTotal: () =>
        set((state) => ({
          booking: {
            ...state.booking,
            totalPrice:
              state.booking.selectedSeats.length * (state.booking.price || 0),
          },
        })),
      resetBooking: () =>
        set({
          booking: {
            film: null,
            cinema: null,
            showtimeId: null,
            showtimeTime: null,
            showDate: null,
            studio: null,
            price: null,
            selectedSeats: [],
            totalPrice: 0,
          },
        }),
    }),
    {
      name: "booking-storage", // name for localStorage key
    }
  )
);
