import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarRaw from "@/components/NavbarRaw";
import Footer from "@/components/Footer";
import xxi from "../../../../public/XXI.svg";
import {
  QrCodeIcon as Qr,
  ArrowDownCircleIcon as Download,
} from "@heroicons/react/24/outline";
import HolesEffect from "@/components/custom/HolesEffect";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

interface TicketTransaction {
  id: number;
  order_id: string;
  appuser_id: number;
  schedule_id: number;
  seats: string[];
  gross_amount: number;
  status: string;
  expires_at: string;
  qr_code_path: string;
  snap_token: string | null;
  created_at: string;
  updated_at: string;
  schedule?: {
    id: number;
    film_id: number;
    cinema_id: number;
    show_date: string;
    show_time: string;
    studio: number;
    price: string;
    cinema: {
      id: number;
      name: string;
      address: string;
    };
    film?: {
      title: string;
    };
  };
}

const fetchScheduleById = async (scheduleId: number) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/dashboard/schedules/${scheduleId}`
    );
    return response.data.data; // Ambil data dari respons API
  } catch (error) {
    console.error(`Error fetching schedule for ID ${scheduleId}:`, error);
    return null; // Fallback jika data tidak ditemukan
  }
};

const fetchFilmById = async (filmId: number) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/dashboard/films/${filmId}`
    );
    return response.data.data; // Ambil data film dari respons API
  } catch (error) {
    console.error(`Error fetching film for ID ${filmId}:`, error);
    return { title: "Judul Film Tidak Ditemukan" }; // Fallback jika data tidak ditemukan
  }
};

function MyTicket() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [showQRModal, setShowQRModal] = useState(false);
  const [tickets, setTickets] = useState<TicketTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState("");

  // Use the auth store
  const { user, isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize(); // Initialize auth state
  }, [initialize]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!isAuthenticated || !user?.id) {
        console.log("User is not authenticated or user ID is missing.");
        return;
      }

      console.log("Fetching tickets for user ID:", user.id);

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/dashboard/ticket-transactions",
          {
            params: {
              appuser_id: user.id,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const ticketsData = Array.isArray(response.data)
          ? response.data
          : response.data.data || response.data.tickets || [];

        // Perkaya data tiket dengan informasi jadwal dan film
        const ticketsWithSchedules = await Promise.all(
          ticketsData.map(async (ticket: TicketTransaction) => {
            const schedule = await fetchScheduleById(ticket.schedule_id);
            const film = schedule ? await fetchFilmById(schedule.film_id) : null;
            return { ...ticket, schedule: { ...schedule, film } };
          })
        );

        console.log("Fetched tickets with schedules:", ticketsWithSchedules);

        setTickets(ticketsWithSchedules);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]); // Set to empty array on error
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isAuthenticated, user?.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Tanggal tidak tersedia";

    try {
      // For Indonesian formatting
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      
      const date = new Date(dateString);
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${dayName}, ${day} ${month} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Format tanggal tidak valid";
    }
  };

  const hasShowTimePassed = (showDate: string, showTime: string) => {
    if (!showDate || !showTime) return false;

    try {
      const showDateTime = new Date(`${showDate} ${showTime}`);
      const now = new Date();
      return now > showDateTime;
    } catch (error) {
      console.error("Error comparing dates:", error);
      return false;
    }
  };

  const activeTickets = tickets.filter((ticket) => {
    if (!ticket.schedule) return false;
    return !hasShowTimePassed(
      ticket.schedule.show_date,
      ticket.schedule.show_time
    );
  });

  const historyTickets = tickets.filter((ticket) => {
    if (!ticket.schedule) return false;
    return hasShowTimePassed(
      ticket.schedule.show_date,
      ticket.schedule.show_time
    );
  });

  const openQRModal = (qrPath: string) => {
    setSelectedQR(qrPath);
    setShowQRModal(true);
  };

  // Fallback display if schedule info is missing
  const renderScheduleInfo = (ticket: TicketTransaction) => {
    if (!ticket.schedule) {
      return (
        <div className="text-white font-medium text-sm p-2 bg-red-900/30 rounded-md">
          <p>Informasi jadwal tidak tersedia</p>
          <p>ID Jadwal: {ticket.id}</p>
        </div>
      );
    }

    return (
      <div className="details flex flex-col md:flex-row md:items-center gap-4 md:gap-8 lg:gap-12 w-full">
        <div className="schedule flex flex-col">
          <p className="text-white/50 text-sm">Hari/Tanggal</p>
          <p className="text-white font-semibold text-base">
            {formatDate(ticket.schedule.show_date)}
          </p>
        </div>
        <div className="schedule flex flex-col">
          <p className="text-white/50 text-sm">Bioskop</p>
          <p className="text-white font-semibold text-base">
            {ticket.schedule.cinema.name}, STUDIO {ticket.schedule.studio}
          </p>
        </div>
        <div className="schedule flex flex-col">
          <p className="text-white/50 text-sm">Jam</p>
          <p className="text-white font-semibold text-base">
            {ticket.schedule.show_time}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto relative flex flex-col text-textprimary">
      <NavbarRaw />
      <div className="wrapper px-[445px] w-full mt-28 flex flex-col items-start gap-6">
        <div className="breadcrumbs font-semibold cursor-pointer text-sm">
          <span
            className="cursor-pointer font-medium"
            onClick={() => navigate("/")}
          >
            Beranda
          </span>{" "}
          / My Tickets
        </div>
        <div className="tiitle text-4xl font-bold">
          <h1>Tiket saya</h1>
        </div>
        <div className="menu w-full">
          <div className="action w-full grid grid-cols-2 items-center text-center">
            <p
              className={`font-medium pb-4 border-b-2 cursor-pointer ${
                activeTab === "active"
                  ? "border-textprimary text-textprimary"
                  : "border-transparent text-textprimary/50"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Aktif
            </p>
            <p
              className={`font-medium pb-4 border-b-2 cursor-pointer ${
                activeTab === "history"
                  ? "border-textprimary text-textprimary"
                  : "border-transparent text-textprimary/50"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Riwayat
            </p>
          </div>
          <div className="horizontal w-full h-[1px] bg-textprimary/20"></div>
        </div>

        <div className="w-full overflow-hidden relative min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Memuat tiket...</p>
            </div>
          ) : (
            <div
              className={`flex transition-transform duration-500 ease-in-out w-[200%]`}
              style={{
                transform:
                  activeTab === "active"
                    ? "translateX(0%)"
                    : "translateX(-50%)",
              }}
            >
              <div className="w-1/2 flex flex-col gap-6">
                {activeTickets.length > 0 ? (
                  activeTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="items-wrapper w-full relative overflow-hidden"
                    >
                      <div className="top flex flex-col w-full bg-gradient-to-r from-blue-950 to to-blue-900 p-5 gap-4 rounded-t-md">
                        <div className="tiitle flex items-center justify-between w-full">
                          <div className="subtitle flex items-center gap-2">
                            <p className="text-xs bg-green-50 border border-green-600 px-1 py-0.5 items-center justify-center rounded-xs font-medium text-green-600">
                              Aktif
                            </p>
                          </div>
                          <img src={xxi} alt="XXI Logo" className="w-12" />
                        </div>
                        {ticket.schedule && (
                          <p className="text-white font-bold text-2xl">
                            {ticket.schedule.film?.title || "Judul Film"}
                          </p>
                        )}
                        {renderScheduleInfo(ticket)}
                      </div>
                      <div className="bottom flex flex-col w-full bg-gradient-to-r from-yellow-500 to to-yellow-400 p-5 gap-4 rounded-b-md relative">
                        <div className="full-information flex flex-col sm:flex-row justify-between w-full gap-4">
                          <div className="details">
                            <div className="details-items flex flex-col sm:flex-row gap-4 sm:gap-8">
                              <div className="place flex flex-col items-start text-sm gap-2 font-medium text-black">
                                <p>Kode Booking</p>
                                <p>{ticket.seats.length} Tiket</p>
                              </div>
                              <div className="place flex flex-col items-start text-sm gap-2 font-semibold text-black">
                                <p className="bg-white/50 px-1 py-0.5 rounded-sm truncate max-w-xs">
                                  {ticket.id}
                                </p>
                                <p>{ticket.seats.join(", ")}</p>
                              </div>
                            </div>
                          </div>
                          <div
                            className="qr items-center flex flex-col bg-blue-950 p-2 rounded-md justify-center border-4 cursor-pointer shadow-md min-w-20"
                            onClick={() => openQRModal(ticket.qr_code_path)}
                          >
                            <Qr className="size-14 text-white" />
                            <p className="text-xs font-semibold text-white">
                              Kode QR
                            </p>
                          </div>
                        </div>
                        <div className="w-full border-[1px] border-textprimary/20 rounded-full"></div>
                        <div className="download w-full flex items-center justify-between">
                          <p className="text-xs -mt-[1px]">
                            Download ticket ke perangkat kamu?
                          </p>
                          <div className="donwlaod-icon flex items-center gap-1 text-blue-950 cursor-pointer">
                            <Download className="size-4" />
                            <p className="font-semibold text-xs">Download</p>
                          </div>
                        </div>
                        <HolesEffect />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-lg">Tidak ada tiket aktif.</p>
                )}
              </div>
              <div className="w-1/2 flex flex-col gap-6">
                {historyTickets.length > 0 ? (
                  historyTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="items-wrapper w-full relative overflow-hidden"
                    >
                      <div className="top flex flex-col w-full bg-gradient-to-r from-blue-950 to to-blue-900 p-5 gap-4 rounded-t-md">
                        <div className="tiitle flex items-center justify-between w-full">
                          <div className="subtitle flex items-center gap-2">
                            <p className="text-xs bg-red-100 border border-red-600 px-1 py-0.5 items-center justify-center rounded-xs font-medium text-red-600">
                              Telah Tayang
                            </p>
                          </div>
                          <img src={xxi} alt="XXI Logo" className="w-12" />
                        </div>
                        {ticket.schedule && (
                          <p className="text-white font-bold text-xl">
                            {ticket.schedule.film?.title || "Judul Film"}
                          </p>
                        )}
                        {renderScheduleInfo(ticket)}
                      </div>
                      <div className="bottom flex flex-col w-full bg-gradient-to-r from-gray-400 to to-gray-300 p-5 gap-4 rounded-b-md relative">
                        <div className="full-information flex justify-between w-full">
                          <div className="details">
                            <div className="details-items flex gap-8">
                              <div className="place flex flex-col items-start text-sm gap-2 font-medium text-black">
                                <p>Kode Booking</p>
                                <p>{ticket.seats.length} Tiket</p>
                              </div>
                              <div className="place flex flex-col items-start text-sm gap-2 font-semibold text-black">
                                <p className="bg-white/50 px-1 rounded-sm">
                                  {ticket.order_id}
                                </p>
                                <p>{ticket.seats.join(", ")}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <HolesEffect />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-lg">Riwayat tiket kamu akan tampil di sini.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-950 rounded-xl p-6 md:p-12 shadow-xl relative animate-fadeIn">
            <button
              className="absolute font-bold text-sm -top-6 -right-5 text-textprimary bg-white w-6 h-6 rounded-full hover:text-red-500 transition-all duration-150 flex items-center justify-center"
              onClick={() => setShowQRModal(false)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-white font-semibold text-lg mb-2">Scan QR Code</h3>
              <div className="bg-white p-2 rounded">
                <img
                  src={`http://127.0.0.1:8000/storage/${selectedQR}`}
                  alt="QR Code"
                  className="w-48 h-48 md:w-64 md:h-64"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/256?text=QR+Not+Found";
                    target.alt = "QR Code Not Found";
                  }}
                />
              </div>
              <p className="text-white text-xs mt-2">Tunjukkan QR code ini saat masuk bioskop</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MyTicket;