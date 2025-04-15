import {
  ArrowLeftCircleIcon as BackIcon,
  InformationCircleIcon as InfoIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useBookingStore } from "@/stores/useBookingStore"; // Adjust path as needed
import { getSeatsBySchedule, Seat } from "@/services/scheduleService";
import dayjs from "dayjs";

function SeatBox({
  seat,
  isSelected,
  isBooked,
  toggleSeat,
}: {
  seat: string;
  isSelected: boolean;
  isBooked: boolean;
  toggleSeat: (seat: string) => void;
}) {
  return (
    <div
      className={clsx(
        "h-12 w-12 rounded-lg flex items-center justify-center font-semibold transition-colors",
        isBooked
          ? "bg-gray-300 text-white cursor-not-allowed"
          : isSelected
          ? "bg-blue-500 text-white cursor-pointer"
          : "bg-black text-white hover:bg-gray-800 cursor-pointer"
      )}
      onClick={() => !isBooked && toggleSeat(seat)}
    >
      {seat}
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function SelectSeat() {
  const navigate = useNavigate();
  const { booking, addSeat, removeSeat } = useBookingStore();

  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = Array.from({ length: 19 }, (_, i) => i + 1);

  const colsLeft = cols.slice(0, 4); // 1-4
  const colsMiddle = cols.slice(4, 15); // 5-15
  const colsRight = cols.slice(15); // 16-19

  useEffect(() => {
    // Redirect if no showtime is selected
    if (!booking.showtimeId) {
      navigate("/buy");
      return;
    }

    // Load booked seats from API
    const loadBookedSeats = async () => {
      try {
        setIsLoading(true);
        const seats = await getSeatsBySchedule(booking.showtimeId!);
        const booked = seats
          .filter((seat: Seat) => seat.status === "booked")
          .map((seat: Seat) => seat.seat_number);
        setBookedSeats(booked);
      } catch (error) {
        console.error("Failed to load seat data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookedSeats();
  }, [booking.showtimeId, navigate]);

  const toggleSeat = (seat: string) => {
    if (booking.selectedSeats.includes(seat)) {
      removeSeat(seat);
    } else {
      addSeat(seat);
    }
  };

  const handleCheckout = () => {
    if (booking.selectedSeats.length > 0) {
      navigate("/payment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="container relative mx-auto w-full overflow-y-auto h-screen px-18 py-6 gap-12 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <BackIcon
            className="w-8 h-8 cursor-pointer"
            onClick={() => navigate("/buy")}
          />
          <p className="text-3xl font-bold">Select Seat</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-lg font-semibold">
            {booking.film?.title} |{" "}
            {booking.studio ? `Studio ${booking.studio}` : ""}
          </p>
          <p className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            {booking.showtimeTime
              ? dayjs(booking.showtimeTime).format("DD MMM • HH:mm")
              : ""}
          </p>
          <InfoIcon className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      <div className="guide flex items-center gap-8 text-gray-600 font-semibold -my-6">
        <div className="flex items-center gap-2">
          <div className="bg-black w-6 h-6 rounded-sm flex items-center justify-center font-semibold text-white"></div>
          <p className="text-sm font-semibold">Available</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 w-6 h-6 rounded-sm flex items-center justify-center font-semibold text-white"></div>
          <p className="text-sm font-semibold">Your Seat</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-300 w-6 h-6 rounded-sm flex items-center justify-center font-semibold text-white"></div>
          <p className="text-sm font-semibold">Not Available</p>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col gap-3 items-center">
        {rows.map((row) => (
          <div key={row} className="flex gap-4 items-center justify-between">
            {/* Left Panel */}
            {colsLeft.map((col) => {
              const seat = `${row}${col}`;
              return (
                <SeatBox
                  key={seat}
                  seat={seat}
                  isSelected={booking.selectedSeats.includes(seat)}
                  isBooked={bookedSeats.includes(seat)}
                  toggleSeat={toggleSeat}
                />
              );
            })}

            {/* Spacer between left and middle */}
            <div className="w-20" />

            {/* Middle Panel */}
            {colsMiddle.map((col) => {
              const seat = `${row}${col}`;
              return (
                <SeatBox
                  key={seat}
                  seat={seat}
                  isSelected={booking.selectedSeats.includes(seat)}
                  isBooked={bookedSeats.includes(seat)}
                  toggleSeat={toggleSeat}
                />
              );
            })}

            {/* Spacer between middle and right */}
            <div className="w-20 " />

            {/* Right Panel */}
            {colsRight.map((col) => {
              const seat = `${row}${col}`;
              return (
                <SeatBox
                  key={seat}
                  seat={seat}
                  isSelected={booking.selectedSeats.includes(seat)}
                  isBooked={bookedSeats.includes(seat)}
                  toggleSeat={toggleSeat}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* theater display */}
      <div className="display w-full flex flex-col items-center gap-4 mb-32">
        <div className="w-full h-3 bg-black rounded-full"></div>
        <p className="font-semibold tracking-widest">DISPLAY</p>
      </div>

      {/* checkout */}
      <div className="checkout flex-col fixed bottom-0 left-0 right-0 w-full border-t items-center justify-center flex">
        <div className="information shadow-sm grid grid-cols-2 gap-4 p-3 items-center text-center justify-center w-full bg-white">
          <div className="subtotal">
            <p className="font-semibold">SUBTOTAL</p>
            <p className="font-semibold">
              {booking.selectedSeats.length > 0
                ? formatCurrency(
                    booking.selectedSeats.length * (booking.price || 0)
                  )
                : "-"}
            </p>
          </div>
          <div className="seat">
            <p className="font-semibold">SEAT SELECTED</p>
            <p className="font-semibold">
              {booking.selectedSeats.length > 0
                ? booking.selectedSeats.join(", ")
                : "-"}
            </p>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className={clsx(
            "font-bold text-lg py-3 w-full transition-colors",
            booking.selectedSeats.length > 0
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-500"
          )}
          disabled={booking.selectedSeats.length === 0}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}

export default SelectSeat;
