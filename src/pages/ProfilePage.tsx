import { Link, useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    BV: 0,
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // Perbarui formData setelah user tersedia
  useEffect(() => {
    console.log("Tanggal lahir sebelum masuk ke state:", user?.tanggal_lahir);
    if (user) {
      setFormData({
        name: user.name || "",
        BV: user.BV || 0,
        email: user.email || "",
      });
    }
  }, [user]); // Hanya dijalankan ketika `user` berubah

  // Tampilkan loading hanya jika autentikasi belum dicek
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
      </div>
    );
  }

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode
            ? "bg-[#140c00] text-[#f0f0f0]"
            : "bg-[#f4f6f9] text-[#353535]"
        } p-4 pt-24 sm:pt-28 w-full min-h-screen`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className={`${
              isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
            } bx bx-arrow-back text-xl md:text-2xl cursor-pointer`}
            onClick={() => navigate(-1)}
          ></i>
          <h1
            className={`${
              isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
            } text-2xl font-bold`}
          >
            Akun saya
          </h1>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between`}
        >
          <div className="flex flex-col gap-2 font-bold">
            <div className="flex flex-row items-center gap-1">
              <i className="bx bx-user"></i>
              <h1 className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                {formData.name}
              </h1>
            </div>

            <div className="flex flex-row items-center gap-1">
              <i className="bx bx-coin-stack"></i>
              <h1>{formData.BV}</h1>
            </div>

            <div className="flex flex-row items-center gap-1">
              <i className="bx bx-envelope"></i>
              <h1 className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                {formData.email}
              </h1>
            </div>
          </div>
          <Link to="/edit-profile">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between`}
        >
          Pesanan Saya
          <Link to="/my-order">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between`}
        >
          History Transaksi BV
          <Link to="/history-bv">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between`}
        >
          Info Jaringan
          <Link to="/downline">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
