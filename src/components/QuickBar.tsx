import Logo from "../../public/Premiere.svg";
import { MapPinIcon as Map } from "@heroicons/react/24/solid";
import {
  FilmIcon as Film,
  BuildingLibraryIcon as Cinema,
  CakeIcon as Cake,
  ReceiptPercentIcon as Promo,
} from "@heroicons/react/24/outline";
import SearchTab from "./custom/searchTab";
function QuickBar() {
  return (
    <div className="container mx-auto w-full flex items-center bg-transparent px-48 text-textprimary flex-col">
      <div className="navbar flex items-center justify-between w-full py-3">
        <div className="left flex items-center gap-8">
          <img src={Logo} alt="" className="w-26" />
          <button className="flex h-fit items-center gap-3 bg-zinc-100 rounded-full py-1 px-4">
            <Map className="size-4" />{" "}
            <span className="font-bold text-sm">JAKARTA</span>
          </button>
        </div>
        <div className="right flex items-center gap-4">
          <button className="text-sm font-semibold cursor-pointer">
            Login
          </button>
          <button className="text-sm font-semibold bg-textsecondary py-2 px-4 rounded-full text-white cursor-pointer ">
            Registration
          </button>
        </div>
      </div>
      <div className="action w-full flex items-center flex-col gap-4 py-10">
        <h1 className="font-bold text-4xl">Hai, mau nonton apa nih? </h1>
        <SearchTab />
        <div className="category flex items-center gap-12 w-full justify-center mt-2">
          <div className="film flex flex-col items-center gap-2">
            <button className="truncate bg-blue-50 p-4 rounded-full">
              <Film className="size-6 text-blue-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Film</p>
          </div>
          <div className="food flex flex-col items-center gap-2">
            <button className="truncate bg-yellow-50 p-4 rounded-full">
              <Cake className="size-6 text-yellow-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Food</p>
          </div>
          <div className="cinema flex flex-col items-center gap-2">
            <button className="truncate bg-green-50 p-4 rounded-full">
              <Cinema className="size-6 text-green-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Cinema</p>
          </div>
          <div className="Promo flex flex-col items-center gap-2">
            <button className="truncate bg-red-50 p-4 rounded-full">
              <Promo className="size-6 text-red-600 truncate m-0  p-0" />
            </button>
            <p className="text-xs font-semibold">Promo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default QuickBar;
