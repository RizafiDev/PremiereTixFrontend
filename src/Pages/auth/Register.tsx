import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  ChevronLeftIcon as ArrowLeft,
} from "@heroicons/react/24/solid";
import { useAuthStore } from "@/stores/useAuthStore";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Semua field harus diisi.");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok.");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Password harus memiliki minimal 6 karakter.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/dashboard/app-users",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const { token, user } = response.data;

        // Optional: cek log biar aman
        console.log("Login success:", { user, token });

        // Simpan ke auth store
        login(user, token);

        // Delay sedikit untuk memastikan store update sebelum redirect
        setTimeout(() => {
          navigate("/");
        }, 100);
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container w-full h-screen flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-[360px] w-full space-y-5 border border-gray-300 bg-white p-7 shadow-xs rounded-md"
      >
        <div className="header">
          <h1 className="font-semibold text-2xl">Daftar</h1>
          <p className="font-medium text-xs">Pastikan data yang diisi benar</p>
          {errorMessage && (
            <div className="text-red-500 text-xs mt-2">{errorMessage}</div>
          )}
        </div>
        <div className="name flex flex-col space-y-2">
          <label htmlFor="name" className="text-xs font-medium">
            Nama Pengguna
          </label>
          <input
            type="text"
            name="name"
            placeholder="Rizafi"
            value={formData.name}
            onChange={handleInputChange}
            className="outline-none pt-1.5 placeholder:font-normal font-medium text-sm pb-2 px-3 rounded-sm border border-gray-300 focus:outline-2 focus:border-cusprimary transition-all"
          />
        </div>
        <div className="email flex flex-col space-y-2">
          <label htmlFor="email" className="text-xs font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            className="outline-none pt-1.5 placeholder:font-normal font-medium text-sm pb-2 px-3 rounded-sm border border-gray-300 focus:outline-2 focus:border-cusprimary transition-all"
          />
        </div>
        <div className="password flex flex-col space-y-2 relative">
          <label htmlFor="password" className="text-xs font-medium">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••"
            value={formData.password}
            onChange={handleInputChange}
            className="outline-none placeholder:font-normal font-medium pt-1.5 text-sm pb-2 px-3 rounded-sm border border-gray-300 focus:outline-2 focus:border-cusprimary transition-all"
          />
          {showPassword ? (
            <EyeSlash
              className="w-5 h-5 text-gray-400 absolute right-3 bottom-4 cursor-pointer transition-all duration-75"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <Eye
              className="w-5 h-5 text-gray-400 absolute right-3 bottom-4 cursor-pointer transition-all duration-75"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
        <div className="password flex flex-col space-y-2 relative">
          <label htmlFor="confirmPassword" className="text-xs font-medium">
            Konfirmasi Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="outline-none placeholder:font-normal font-medium pt-1.5 text-sm pb-2 px-3 rounded-sm border border-gray-300 focus:outline-2 focus:border-cusprimary transition-all"
          />
          {showPassword ? (
            <EyeSlash
              className="w-5 h-5 text-gray-400 absolute right-3 bottom-4 cursor-pointer transition-all duration-75"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <Eye
              className="w-5 h-5 text-gray-400 absolute right-3 bottom-4 cursor-pointer transition-all duration-75"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer text-white text-xs font-medium py-2.5 rounded-sm w-full flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            "Daftar"
          )}
        </button>
        <p className="text-xs text-gray-600 font-medium text-center">
          Sudah memiliki akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Masuk
          </span>
        </p>
      </form>
      <button
        onClick={() => navigate("/")}
        className="max-w-[360px] w-full py-3 cursor-pointer hover:bg-neutral-50 transition-all bg-white rounded-sm flex items-center justify-center gap-1 shadow-xs text-xs font-medium mt-5 border border-gray-300"
      >
        <ArrowLeft className="w-3 h-3 font-semibold" />
        Kembali
      </button>
    </section>
  );
}

export default Register;
