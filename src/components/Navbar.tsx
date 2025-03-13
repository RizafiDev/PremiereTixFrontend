import Logo from "../../public/Premiere.svg";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ArrowRightEndOnRectangleIcon as MasukIcon } from "@heroicons/react/24/solid";
import { UserPlusIcon as DaftarIcon } from "@heroicons/react/24/solid";
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="container fixed z-50 backdrop-blur-xl backdrop-brightness-50 shadow-sm bg-transparent flex items-center w-full mx-auto my-auto justify-between pl-5 pr-7">
      <div className="brand">
        <img src={Logo} alt="" className="w-36" />
      </div>
      <div className="profile flex items-center space-x-5">
        <div className="search relative flex items-center">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 text-cuswhite" />
          <input
            type="text"
            placeholder="Cari Film"
            className="outline-2 focus:outline-cuswhite w-[300px] transition-all text-cuswhite outline-cuswhite placeholder:text-cuswhite rounded-sm pt-2 pb-2 px-1.5 pl-9.5 truncate flex font-semibold text-sm"
          />
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-cuswhite cursor-pointer items-center gap-1 flex font-semibold border py-2 text-sm  transition-all rounded-lg border-cuswhite px-5 truncate"
        >
          <MasukIcon className="w-4 h-4" />
          Masuk
        </button>
        <button className="font-semibold py-2 items-center gap-1 flex text-sm rounded-lg text-cusprimary bg-cuswhite px-5 truncate transition-all">
          <DaftarIcon className="w-4 h-4" />
          Daftar
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
