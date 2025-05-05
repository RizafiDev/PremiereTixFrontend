import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarRaw from "@/components/NavbarRaw";
import Footer from "@/components/Footer";
import xxi from "../../../../public/XXI.svg";
import {
  QrCodeIcon as Qr,
  ArrowDownCircleIcon as Download,
} from "@heroicons/react/24/outline";
import HolesEffect from "@/components/custom/HolesEffect";

function MyTicket() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [showQRModal, setShowQRModal] = useState(false);

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

        {/* Tab content with slide transition */}
        <div className="w-full overflow-hidden relative h-[300px]">
          <div
            className={`flex transition-transform duration-500 ease-in-out w-[200%]`}
            style={{
              transform:
                activeTab === "active" ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            <div className="w-1/2 flex flex-col gap-6">
              {/* Konten Tiket Aktif */}
              <div className="items-wrapper w-full relative">
                <div className="top flex flex-col w-full bg-gradient-to-r from-blue-950 to to-blue-900 p-5 gap-4 rounded-t-md ">
                  <div className="tiitle flex items-center justify-between w-full">
                    <p className="uppercase font-semibold text-lg text-white">
                      KOMANG
                    </p>
                    <img src={xxi} alt="" className="w-12 " />
                  </div>
                  <div className="details flex items-center gap-12 w-full ">
                    <div className="schedule flex flex-col ">
                      <p className="text-white/50 text-sm">Hari/Tanggal</p>
                      <p className="text-white font-semibold text-base">
                        Kamis, 03 Apr 2025
                      </p>
                    </div>
                    <div className="schedule flex flex-col">
                      <p className="text-white/50 text-sm">Bioskop</p>
                      <p className="text-white font-semibold text-base">
                        SOLO PARAGON XXI, STUDIO 1
                      </p>
                    </div>
                    <div className="schedule flex flex-col justify-end">
                      <p className="text-white/50 text-sm">Jam</p>
                      <p className="text-white font-semibold text-base">
                        16:20
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bottom flex flex-col w-full bg-gradient-to-r from-yellow-500 to to-yellow-400 p-5 gap-4 rounded-b-md relative">
                  <div className="full-information flex justify-between w-full">
                    <div className="details">
                      <div className="details-items flex gap-8">
                        <div className="place flex flex-col items-start text-sm gap-2 font-medium text-black">
                          <p>Kode Booking</p>
                          <p>2 Tiket</p>
                        </div>
                        <div className="place flex flex-col items-start text-sm gap-2 font-semibold text-black">
                          <p className="bg-white/50 px-1 rounded-sm">123</p>
                          <p>A10, A11</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="qr items-center flex flex-col bg-blue-950 h-22 w-22 rounded-md justify-center border-4 cursor-pointer shadow-md"
                      onClick={() => setShowQRModal(true)}
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
                      <p className="font-semibold text-xs ">Download</p>
                    </div>
                  </div>
                  {/* Tambahkan elemen untuk efek lubang */}
                  <HolesEffect />
                </div>
              </div>
            </div>
            <div className="w-1/2 px-4">
              {/* Konten Tiket Riwayat */}
              <p className="text-lg">Riwayat tiket kamu akan tampil di sini.</p>
            </div>
          </div>
        </div>
      </div>
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-950 rounded-xl  p-12 shadow-xl relative animate-fadeIn">
            <button
              className="absolute font-bold text-sm -top-6 -right-5 text-textprimary bg-white w-6 h-6 rounded-full hover:text-red-500 transition-all duration-150 "
              onClick={() => setShowQRModal(false)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-4">
                {/* Simulasi kode QR, bisa diganti <img src={qrImageUrl} /> */}
                <div className="bg-white p-2 rounded">
                  <img
                    src="/path/to/generated-qr.png"
                    alt="QR Code"
                    className="w-64 h-64"
                  />
                </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
export default MyTicket;
