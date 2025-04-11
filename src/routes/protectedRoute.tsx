import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkMode";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth();
  const { isDarkMode } = useDarkMode();

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
