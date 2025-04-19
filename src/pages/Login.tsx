import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkMode";
import NavbarComponent from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { fetchCart } = useCart();
  const { login, isLoggedIn, setIsLoggedIn, setUser, loading } = useAuth();
  const { isDarkMode } = useDarkMode();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);

      console.log("🟢 Login berhasil, token:", data.token); // Debugging

      setUser(data.user); // 🔥 Update user di global state
      setIsLoggedIn(true); // 🔥 Update status login di AuthContext

      await fetchCart(); // Panggil fetchCart setelah login
      navigate("/"); // Redirect ke halaman dashboard

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("🔴 Error login:", err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex justify-center items-center min-h-screen`}
      >
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Memuat data...
        </p>
        {/* Tambahkan spinner atau skeleton loader di sini */}
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex justify-center items-center min-h-screen`}
      >
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Anda sudah login...
        </p>
        {/* Tambahkan spinner atau skeleton loader di sini */}
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
      } flex h-full p-6 pt-28 sm:pt-32 items-center justify-center`}
    >
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#303030]" : "bg-white"
        } w-full max-w-md p-8 rounded-2xl`}
      >
        <div className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
          <Link to="/">
            <img
              src="https://k-net.co.id/assets/images/logo.png"
              className="h-8 inline-block"
              alt="K-Link"
              loading="lazy"
            />
            <span
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
              } inline-block`}
            >
              Login K-Smart
            </span>
          </Link>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#353535]"
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-4 border-none rounded-xl ${
              isDarkMode
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-[#f0f0f0] text-[#353535]"
            }`}
          />
          <button
            type="submit"
            className="w-full p-4 font-bold text-white rounded-xl bg-[#28a154] hover:bg-[#167e3c] cursor-pointer"
          >
            Login
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="flex justify-center items-center gap-1 mt-4">
            <p
              className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}
            >
              Belum punya akun?
            </p>
            <Link
              to="/register"
              type="button"
              className={`${
                isDarkMode ? "text-[#28a154]" : "text-[#28a154]"
              } hover:underline cursor-pointer inline-flex`}
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
