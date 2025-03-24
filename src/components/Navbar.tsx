import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon as MasukIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon as DaftarIcon } from "@heroicons/react/24/outline";
import Logo from "../../public/Premiere.svg";
import { ArrowRightStartOnRectangleIcon as LogoutIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon as HelpIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SelectRegion from "./custom/selectRegion";
import SearchTab from "./custom/searchTab";
import Avatar from "./custom/avatar";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Cek status login saat komponen di-render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).name);
      setUserEmail(JSON.parse(user).email);
    } else {
      setIsLoggedIn(false);
    }

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!token && !!user);
      if (user) {
        setUserName(JSON.parse(user).name);
        setUserEmail(JSON.parse(user).email);
      } else {
        setUserName("");
        setUserEmail("");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    localStorage.removeItem("user"); // Hapus data user
    setIsLoggedIn(false); // Perbarui status login
    window.dispatchEvent(new Event("storage")); // Trigger event untuk memperbarui komponen lain
    navigate("/"); // Arahkan ke login
  };

  return (
    <nav className="container  z-50 backdrop-blur-xl backdrop-brightness-50 shadow-sm bg-white flex items-center w-full mx-auto my-auto justify-between pl-5 pr-7">
      <div className="brand">
        <img src={Logo} alt="" className="w-36" />
      </div>
      <SearchTab />
      <div className="profile flex items-center space-x-5">
        <div className="search relative flex items-center">
          {/* <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 text-black" />
          <input
            type="text"
            placeholder="Cari Film"
            className="outline-2 focus:outline-black w-[300px] transition-all text-black outline-black placeholder:text-black rounded-sm pt-2 pb-2 px-1.5 pl-9.5 truncate flex font-semibold text-sm"
          /> */}

          <SelectRegion />
        </div>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="information -space-y-2 flex flex-col pr-8">
                <DropdownMenuLabel className="font-semibold text-md">
                  Hello, {userName}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal">
                  {userEmail}
                </DropdownMenuLabel>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>My Ticket</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 hover:text-red-600"
                onClick={(e) => e.preventDefault()} // Tambahkan ini
              >
                <AlertDialog>
                  <AlertDialogTrigger
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()} // Tambahkan ini
                  >
                    <LogoutIcon className="text-red-500 hover:text-red-600" />
                    Keluar
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Apakah kamu benar-benar ingin keluar?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Keluar dari akun akan menghapus semua data yang
                        tersimpan di perangkat ini.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Kembali</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Ya, saya yakin
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-black cursor-pointer items-center gap-1 flex font-semibold border py-2 text-sm transition-all rounded-lg border-black px-5"
            >
              <MasukIcon className="w-4 h-4" />
              Masuk
            </button>
            <button
              onClick={() => navigate("/register")}
              className="font-semibold py-2 cursor-pointer items-center gap-1 flex text-sm rounded-lg text-white bg-black px-5 transition-all"
            >
              <DaftarIcon className="w-4 h-4" />
              Daftar
            </button>
          </>
        )}
        <HelpIcon className="w-6 h-6 text-black cursor-pointer" />
      </div>
    </nav>
  );
}

export default Navbar;
