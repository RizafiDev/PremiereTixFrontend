import {
    ArrowLeftCircleIcon as BackIcon,
    InformationCircleIcon as InfoIcon,
  } from "@heroicons/react/24/outline";
  import { useNavigate } from "react-router-dom";
  import { useState } from "react";
  import clsx from "clsx";
  
  function SelectSeat() {
    const navigate = useNavigate();
  
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
    const cols = Array.from({ length: 19 }, (_, i) => i + 1);
  
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
    const toggleSeat = (seat: string) => {
      setSelectedSeats((prev) =>
        prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
      );
    };
  
    const colsLeft = cols.slice(0, 4);       // 1-4
    const colsMiddle = cols.slice(4, 15);    // 5-15
    const colsRight = cols.slice(15);        // 16-19
  
    return (
      <div className="container mx-auto w-full h-screen px-4 sm:px-8 py-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <BackIcon className="w-8 h-8 cursor-pointer" onClick={() => navigate("/buy")} />
            <p className="text-3xl font-bold">Select Seat</p>
          </div>
          <InfoIcon className="w-8 h-8 text-gray-600" />
        </div>
  
        {/* Seat Grid */}
        <div className="mt-8 grid grid-cols-3 gap-8 justify-center">
          {/* Left Panel */}
          <div className="grid grid-cols-4 gap-4">
            {rows.map((row) =>
              colsLeft.map((col) => {
                const seat = `${row}${col}`;
                return (
                  <div
                    key={seat}
                    className={clsx(
                      "h-14 w-16 rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-colors",
                      selectedSeats.includes(seat)
                        ? "bg-green-500 text-white"
                        : "bg-black text-white hover:bg-gray-800"
                    )}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat}
                  </div>
                );
              })
            )}
          </div>
  
          {/* Middle Panel */}
          <div className="grid grid-cols-5 gap-4">
            {rows.map((row) =>
              colsMiddle.map((col) => {
                const seat = `${row}${col}`;
                return (
                  <div
                    key={seat}
                    className={clsx(
                      "h-14 w-16 rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-colors",
                      selectedSeats.includes(seat)
                        ? "bg-green-500 text-white"
                        : "bg-black text-white hover:bg-gray-800"
                    )}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat}
                  </div>
                );
              })
            )}
          </div>
  
          {/* Right Panel */}
          <div className="grid grid-cols-4 gap-4">
            {rows.map((row) =>
              colsRight.map((col) => {
                const seat = `${row}${col}`;
                return (
                  <div
                    key={seat}
                    className={clsx(
                      "h-14 w-16 rounded-lg flex items-center justify-center font-semibold cursor-pointer transition-colors",
                      selectedSeats.includes(seat)
                        ? "bg-green-500 text-white"
                        : "bg-black text-white hover:bg-gray-800"
                    )}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat}
                  </div>
                );
              })
            )}
          </div>
        </div>
  
        {/* Selected Seats */}
        <div className="mt-10 text-center">
          <p className="text-lg font-medium">
            Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </p>
        </div>
      </div>
    );
  }
  
  export default SelectSeat;
  