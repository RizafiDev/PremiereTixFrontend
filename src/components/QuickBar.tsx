import { useNavigate } from "react-router-dom";
import {
  FilmIcon as Film,
  BuildingLibraryIcon as Cinema,
  CakeIcon as Cake,
  ReceiptPercentIcon as Promo,
  ViewfinderCircleIcon as Scanner,
} from "@heroicons/react/24/outline";
import SearchTab from "./custom/searchTab";
function QuickBar() {
  const navigate = useNavigate();

  // Cek status login saat komponen di-render

  return (
    <div className="container mx-auto w-full flex items-center bg-transparent md:px-48 px-4 text-textprimary dark:text-white flex-col mt-24">
      <div className="action w-full flex items-center flex-col gap-4 md:py-10">
        <h1 className="font-bold text-2xl md:text-4xl">
          Hai, mau nonton apa nih?
        </h1>
        <SearchTab />
        <div className="category flex items-center gap-5 md:gap-12 w-full justify-center mt-2">
          <div className="film flex flex-col items-center gap-2">
            <button className="truncate bg-blue-50 p-4 rounded-full cursor-pointer">
              <Film className="size-6 text-blue-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Film</p>
          </div>
          <div className="food flex flex-col items-center gap-2">
            <button className="truncate bg-yellow-50 p-4 rounded-full cursor-pointer">
              <Cake className="size-6 text-yellow-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Food</p>
          </div>
          <div className="cinema flex flex-col items-center gap-2">
            <button className="truncate bg-green-50 p-4 rounded-full cursor-pointer">
              <Cinema className="size-6 text-green-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Cinema</p>
          </div>
          <div className="Promo flex flex-col items-center gap-2">
            <button className="truncate bg-red-50 p-4 rounded-full cursor-pointer">
              <Promo className="size-6 text-red-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Promo</p>
          </div>
          <div className="scan flex flex-col items-center gap-2">
            <button
              onClick={() => navigate("/scanner")}
              className="truncate bg-violet-50 p-4 rounded-full cursor-pointer"
            >
              <Scanner className="size-6 text-violet-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Scan QR</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default QuickBar;
