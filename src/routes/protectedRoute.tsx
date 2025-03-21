import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useDarkMode } from "../context/DarkMode";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();


  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulasi cek autentikasi
  }, []);

  if (loading)
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

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
