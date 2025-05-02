import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarRaw from "@/components/NavbarRaw";
import Footer from "@/components/Footer";
import AdList from "@/components/AdList";
import xxi from "../../../../public/XXI.svg";

function MyTicket() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

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
            <div className="w-1/2">
              {/* Konten Tiket Aktif */}
              <div className="items-wrapper w-full">
                <div className="top flex w-full bg-gradient-to-r from-blue-950 to to-blue-900 p-4">
                  <div className="tiitle flex items-center justify-between w-full">
                    <p className="uppercase font-semibold text-lg text-white">
                      KOMANG
                    </p>
                    <img src={xxi} alt="" className="w-12" />
                  </div>
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
      <Footer />
    </div>
  );
}
export default MyTicket;
