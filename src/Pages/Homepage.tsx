import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import PlayingFilm from "@/components/PlayingFilm";
import { useBookingStore } from "@/stores/useBookingStore"; // Import useBookingStore

function Homepage() {
  const { resetBooking } = useBookingStore(); // Akses resetBooking dari Zustand store

  useEffect(() => {
    // Reset booking ketika user berada di homepage
    resetBooking();
  }, [resetBooking]); // Hanya dipanggil sekali saat komponen pertama kali render

  return (
    <>
      <Navbar />
      <Header />
      <PlayingFilm />
    </>
  );
}

export default Homepage;
