import {
  ArrowLeftCircleIcon as BackIcon,
  InformationCircleIcon as InfoIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import clsx from "clsx";

function SeatBox({
  seat,
  selectedSeats,
  toggleSeat,
}: {
  seat: string;
  selectedSeats: string[];
  toggleSeat: (seat: string) => void;
}) {
  return (
    <div
      className={clsx(
        "h-12 w-12 rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-colors",
        selectedSeats.includes(seat)
          ? "bg-green-500 text-white"
          : "bg-black text-white hover:bg-gray-800"
      )}
      onClick={() => toggleSeat(seat)}
    >
      {seat}
    </div>
  );
}

function SelectSeat() {
  const navigate = useNavigate();

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = Array.from({ length: 19 }, (_, i) => i + 1);

  const colsLeft = cols.slice(0, 4); // 1-4
  const colsMiddle = cols.slice(4, 15); // 5-15
  const colsRight = cols.slice(15); // 16-19

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="container mx-auto w-full h-screen px-4 sm:px-8 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <BackIcon
            className="w-8 h-8 cursor-pointer"
            onClick={() => navigate("/buy")}
          />
          <p className="text-3xl font-bold">Select Seat</p>
        </div>
        <InfoIcon className="w-8 h-8 text-gray-600" />
      </div>

      {/* Seat Grid */}
      <div className="mt-8 flex flex-col gap-3 items-center">
        {rows.map((row) => (
          <div key={row} className="flex gap-4 items-center justify-between">
            {/* Left Panel */}
            {colsLeft.map((col) => {
              const seat = `${row}${col}`;
              return (
                <SeatBox
                  key={seat}
                  seat={seat}
                  selectedSeats={selectedSeats}
                  toggleSeat={toggleSeat}
                />
              );
            })}

            {/* Spacer between left and middle */}
            <div className="w-12" />

            {/* Middle Panel */}
            {colsMiddle.map((col) => {
              const seat = `${row}${col}`;
              return (
                <SeatBox
                  key={seat}
                  seat={seat}
                  selectedSeats={selectedSeats}
                  toggleSeat={toggleSeat}
                />
              );
            })}

            {/* Spacer between middle and right */}
            <div className="w-12 " />

            {/* Right Panel */}
            {colsRight.map((col) => {
              const seat = `${row}${col}`;
              return (
                <SeatBox
                  key={seat}
                  seat={seat}
                  selectedSeats={selectedSeats}
                  toggleSeat={toggleSeat}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* theater display */}
      <div className="display w-full ">
        <div className="w-full h-2 bg-gray-400 rounded-full"></div>
      </div>
      {/* Selected Seats */}
      <div className="mt-10 text-center">
        <p className="text-lg font-medium">
          Selected Seats:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}

export default SelectSeat;
