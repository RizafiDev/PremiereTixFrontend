import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  ChevronLeftIcon as ArrowLeft,
} from "@heroicons/react/24/solid";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false, // Untuk checkbox "Ingat saya"
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) {
      setErrorMessage("Email dan Password harus diisi.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Email tidak valid.");
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
      // Data yang akan dikirim ke API
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      // Kirim data ke API menggunakan axios
      const response = await axios.post(
        "http://127.0.0.1:8000/api/dashboard/app-users/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Jika login berhasil, simpan remember_token dan navigasi ke dashboard
      if (response.status === 200 || response.status === 201) {
        const { token, user } = response.data;

        // Simpan token dan data user di localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Navigasi ke halaman utama
        navigate("/");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat login. Silakan coba lagi."
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
          <h1 className="font-semibold text-2xl">Masuk</h1>
          <p className="font-medium text-xs">Pastikan data yang diisi benar</p>
          {errorMessage && (
            <div className="text-red-500 text-xs mt-2">{errorMessage}</div>
          )}
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
        <div className="additional flex items-center justify-between">
          <div className="remember-me flex items-center">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={formData.remember}
              onChange={handleInputChange}
              className="mr-2 outline-none border border-gray-300 rounded-sm"
            />
            <label htmlFor="remember" className="text-xs font-medium">
              Ingat saya
            </label>
          </div>
          <a href="#" className="text-xs font-medium text-blue-600">
            Lupa password?
          </a>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer text-white text-xs font-medium py-2.5 rounded-sm w-full flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            "Masuk"
          )}
        </button>
        <p className="text-xs text-gray-600 font-medium text-center">
          Belum memiliki akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Daftar
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

export default Login;
