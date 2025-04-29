import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../public/Premiere.svg";
import LogoColor from "../../public/PremiereColor.svg";
import { MapPinIcon as Map } from "@heroicons/react/24/solid";
import Avatar from "./custom/avatar";
import { useTheme } from "@/context/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
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


function NavbarRaw() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 160);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <div
      className={`container mx-auto w-full flex fixed z-[999] items-center px-4 md:px-8 text-textprimary dark:text-white flex-col transition-colors duration-400 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xs dark:bg-black/80"
          : "bg-transparent"
      }`}
    >
      <div className="navbar flex items-center md:justify-between w-full py-3">
        <div className="left flex items-center gap-8 md:w-fit w-full justify-between">
          <img src={Logo} alt="" className="w-26 dark:hidden flex" />
          <img src={LogoColor} alt="" className="w-26 dark:flex hidden" />
          <button className="flex h-fit items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-full py-1 px-4">
            <Map className="size-4" />{" "}
            <span className="font-bold text-sm">JAKARTA</span>
          </button>
        </div>
        <div className="right  items-center gap-4 hidden md:flex">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 bg-muted text-muted-foreground hover:scale-110 dark:bg-muted dark:text-muted-foreground shadow"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="size-5 text-yellow-400 transition-opacity duration-300" />
            ) : (
              <MoonIcon className="size-5 text-indigo-600 transition-opacity duration-300" />
            )}
          </button>
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
                className="text-sm font-semibold bg-textsecondary dark:text-black py-2 px-4 rounded-full text-white cursor-pointer "
              >
                Registration
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default NavbarRaw;
