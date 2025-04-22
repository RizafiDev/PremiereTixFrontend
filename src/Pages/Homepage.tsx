import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdList from "@/components/AdList";
import PlayingFilm from "@/components/PlayingFilm";
import { useBookingStore } from "@/stores/useBookingStore"; // Import useBookingStore
import QuickBar from "@/components/QuickBar";

function Homepage() {
  const { resetBooking } = useBookingStore(); // Akses resetBooking dari Zustand store

  useEffect(() => {
    // Reset booking ketika user berada di homepage
    resetBooking();
  }, [resetBooking]); // Hanya dipanggil sekali saat komponen pertama kali render

  return (
    <div>
      {/* <Navbar /> */}
      <QuickBar />
      <AdList />
      <PlayingFilm />
    </div>
  );
}

export default Homepage;
