import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdList from "@/components/AdList";
import PlayingFilm from "@/components/PlayingFilm";
import { useBookingStore } from "@/stores/useBookingStore"; // Import useBookingStore
import QuickBar from "@/components/QuickBar";
import CouponBanner from "@/components/CouponBanner";

function Homepage() {
  const { resetBooking } = useBookingStore(); // Akses resetBooking dari Zustand store

  useEffect(() => {
    // Reset booking ketika user berada di homepage
    resetBooking();
  }, [resetBooking]); // Hanya dipanggil sekali saat komponen pertama kali render

  return (
    <div className="flex flex-col gap-10">
      {/* <Navbar /> */}
      <QuickBar />
      <AdList />
      <PlayingFilm />
      <CouponBanner />
    </div>
  );
}

export default Homepage;
