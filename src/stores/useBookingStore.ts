import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Film } from "@/services/filmService";
import { Cinema } from "@/services/scheduleService";

export interface BookingData {
  film: Film | null;
  cinema: Cinema | null;
  showtimeId: number | null; // This corresponds to schedule_id in DB
  showtimeTime: string | null;
  showDate: string | null;
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
        set((state) => ({
          booking: {
            ...state.booking,
            selectedSeats: seats,
            totalPrice: seats.length * (state.booking.price || 0),
          },
        })),
      addSeat: (seat) =>
        set((state) => {
          if (state.booking.selectedSeats.includes(seat)) {
            return state;
          }
          const selectedSeats = [...state.booking.selectedSeats, seat];
          return {
            booking: {
              ...state.booking,
              selectedSeats,
              totalPrice: selectedSeats.length * (state.booking.price || 0),
            },
          };
        }),
      removeSeat: (seat) =>
        set((state) => {
          const selectedSeats = state.booking.selectedSeats.filter(
            (s) => s !== seat
          );
          return {
            booking: {
              ...state.booking,
              selectedSeats,
              totalPrice: selectedSeats.length * (state.booking.price || 0),
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
      name: "booking-storage",
    }
  )
);
