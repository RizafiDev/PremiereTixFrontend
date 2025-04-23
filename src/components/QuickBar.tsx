import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../public/Premiere.svg";
import { MapPinIcon as Map } from "@heroicons/react/24/solid";
import Avatar from "./custom/avatar";
import {
  FilmIcon as Film,
  BuildingLibraryIcon as Cinema,
  CakeIcon as Cake,
  ReceiptPercentIcon as Promo,
  ViewfinderCircleIcon as Scanner,
} from "@heroicons/react/24/outline";
import SearchTab from "./custom/searchTab";
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

function QuickBar() {
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
          {/* login */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute -right-5 top-2">
                <div className="information -space-y-2 flex flex-col pr-8">
                  <DropdownMenuLabel className="font-semibold text-xs">
                    Hello, {userName}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="font-medium text-xs">
                    {userEmail}
                  </DropdownMenuLabel>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs font-medium">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs font-medium">
                  My Ticket
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 hover:text-red-600 text-xs font-medium"
                  onClick={(e) => e.preventDefault()} // Tambahkan ini
                >
                  <AlertDialog>
                    <AlertDialogTrigger
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()} // Tambahkan ini
                    >
                      Sign Out
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
                className="text-sm font-semibold cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm font-semibold bg-textsecondary py-2 px-4 rounded-full text-white cursor-pointer "
              >
                Registration
              </button>
            </>
          )}
        </div>
      </div>
      <div className="action w-full flex items-center flex-col gap-4 py-10">
        <h1 className="font-bold text-4xl">Hai, mau nonton apa nih? </h1>
        <SearchTab />
        <div className="category flex items-center gap-12 w-full justify-center mt-2">
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
