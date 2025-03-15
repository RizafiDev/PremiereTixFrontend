import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ArrowRightEndOnRectangleIcon as MasukIcon } from "@heroicons/react/24/solid";
import { UserPlusIcon as DaftarIcon } from "@heroicons/react/24/solid";
import Logo from "../../public/Premiere.svg";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status login saat komponen di-render
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set status login berdasarkan token

    // Tambahkan event listener untuk mendeteksi perubahan di localStorage
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    localStorage.removeItem("user"); // Hapus data user
    setIsLoggedIn(false); // Perbarui status login
    window.dispatchEvent(new Event("storage")); // Trigger event untuk memperbarui komponen lain
    navigate("/login"); // Arahkan ke login
  };

  return (
    <nav className="container fixed z-50 backdrop-blur-xl backdrop-brightness-50 shadow-sm bg-transparent flex items-center w-full mx-auto my-auto justify-between pl-5 pr-7">
      <div className="brand">
        <img src={Logo} alt="" className="w-36" />
      </div>
      <div className="profile flex items-center space-x-5">
        <div className="search relative flex items-center">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 text-white" />
          <input
            type="text"
            placeholder="Cari Film"
            className="outline-2 focus:outline-white w-[300px] transition-all text-white outline-white placeholder:text-white rounded-sm pt-2 pb-2 px-1.5 pl-9.5 truncate flex font-semibold text-sm"
          />
        </div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white cursor-pointer items-center gap-1 flex font-semibold border py-2 text-sm transition-all rounded-lg border-white px-5"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-white cursor-pointer items-center gap-1 flex font-semibold border py-2 text-sm transition-all rounded-lg border-white px-5"
            >
              <MasukIcon className="w-4 h-4" />
              Masuk
            </button>
            <button
              onClick={() => navigate("/register")}
              className="font-semibold py-2 items-center gap-1 flex text-sm rounded-lg text-black bg-white px-5 transition-all"
            >
              <DaftarIcon className="w-4 h-4" />
              Daftar
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
