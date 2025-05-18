import { Link, useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { getPlanName } from "../utils/getPlanName";
import usePlans from "../context/PlanContext";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { plans } = usePlans(); // ← pakai tanda kurung () ✔️
  const [formData, setFormData] = useState({
    id: 0,
    uid: "",
    name: "",
    profile_picture: "",
    BV: 0,
    plan: 1,
    email: "",
  });
  const navigate = useNavigate();
  const totalItems = wishlistItems.length;
  const [orders, setOrders] = useState<
    {
      shipment_status: string;
    }[]
  >([]);

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
        uid: user.uid || "",
        id: user.id || 0,
        name: user.name || "",
        profile_picture:
          typeof user.profile_picture === "string" ? user.profile_picture : "",
        BV: user.BV || 0,
        plan: user.id_plan || 1,
        email: user.email || "",
      });
    }
  }, [user]); // Hanya dijalankan ketika `user` berubah

  useEffect(() => {
    if (user) {
      console.log("User Data:", user);
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/transactions/user/${user.id}`
        )
        .then((response) => {
          console.log("Orders Response:", response.data); // Cek data API di console
          setOrders(response.data.data);
        })
        .catch((error) => {
          console.error("❌ Fetch Orders Failed:", error);
        });
    }
  }, [user]);

  const totalPesanan = useMemo(() => {
    return orders.filter((order) => order.shipment_status === "dikirim").length;
  }, [orders]);

  // Tampilkan loading hanya jika autentikasi belum dicek
  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex gap-2 justify-center items-center min-h-screen z-9999`}
      >
        <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin ml-2"></div>
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
        } p-6 pt-24 sm:pt-28 w-full min-h-screen max-w-4xl mx-auto`}
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

        {/* Biodata Info */}
        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex flex-col items-center gap-4 mb-4 mt-4`}
        >
          <img
            src={`${import.meta.env.VITE_APP_API_URL}/uploads/profile/${
              formData.profile_picture
            }`}
            alt="Current Profile"
            className="w-24 h-24 rounded-full object-cover shadow-lg"
          />
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-xl truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
              {formData.name}
            </h1>
            <p className="font-normal text-sm truncate max-w-[250px] sm:max-w-[400px] md:max-w-[500px] overflow-hidden text-ellipsis whitespace-nowrap">
              {formData.uid}
            </p>
          </div>

          {/* Baris kotak info */}
          <div className="flex justify-between w-full max-w-xs">
            <div className="flex flex-col items-center gap-1 w-1/3">
              <i className="bx bx-coin-stack text-xl"></i>
              <h1 className="font-semibold text-base">{formData.BV}</h1>
            </div>

            <div className="flex flex-col items-center gap-1 w-1/3">
              <i className="bx bx-archive-in text-xl"></i>
              <h1 className="font-semibold text-base">
                {getPlanName(formData.plan, plans)}
              </h1>
            </div>

            <div className="flex flex-col items-center gap-1 w-1/3">
              <i className="bx bx-envelope text-xl"></i>
              <h1 className="font-semibold text-base truncate max-w-[80px] text-center">
                {formData.email}
              </h1>
            </div>
          </div>

          <Link
            to="/edit-profile"
            className="bg-[#28A154] text-[#FFFFFF] p-2 items-center flex gap-1 justify-center rounded-lg text-center font-semibold w-full cursor-pointer"
          >
            <i className="bx bx-cog text-xl"></i> Edit Profile
          </Link>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between`}
        >
          <div className="flex flex-col gap-2">
            <span className="font-bold ">Pesanan Saya</span>
            <span className="font-semibold text-[#959595]">
              {totalPesanan} Sedang Dikirim
            </span>
          </div>
          <Link to="/my-order">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between font-bold`}
        >
          <div className="flex">
            <span>Favorite</span>
            <span className="text-[#959595]">
              {totalItems > 0 ? `(${totalItems})` : ""}
            </span>
          </div>

          <Link to="/wishlist">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between font-bold`}
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
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between font-bold`}
        >
          BV Report
          <Link to="/bv-report">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } p-4 rounded-lg flex items-center mb-4 mt-4 justify-between font-bold`}
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
