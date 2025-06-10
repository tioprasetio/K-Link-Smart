// pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import useProducts from "../context/ProductContext";
import SkeletonListProduct from "../components/SkeletonListProduct";
import CardProduct from "../components/CardProduct";
import NavbarComponent from "../components/Navbar";
import Banner from "../components/Banner";
import SearchBar from "../components/SearchBar";
import Category from "../components/Categories";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";
import Payment from "../components/Payment";
import PopupVoucher from "../components/PopupVoucher";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const HomePage = () => {
  const { products, loading } = useProducts();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [loadingShip, setLoadingShip] = useState(true);
  const [isPopupClosed, setIsPopupClosed] = useState(false);
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [orders, setOrders] = useState<
    {
      shipment_status: string;
    }[]
  >([]);

  const dikirimCount = orders.filter(
    (order) => order.shipment_status === "dikirim"
  ).length;

  useEffect(() => {
    if (user) {
      setLoadingShip(true);
      // console.log("User Data:", user);
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/transactions/user/${user.id}`
        )
        .then((response) => {
          // console.log("Orders Response:", response.data);
          setOrders(response.data.data);
          setLoadingShip(false);
        })
        .catch((error) => {
          console.error("❌ Fetch Orders Failed:", error);
          setLoadingShip(false);
        });
    } else {
      // User belum login, langsung set loadingShip ke false
      setLoadingShip(false);
    }
  }, [user]);

  useEffect(() => {
    const showShipmentAlert = async () => {
      if (!isPopupClosed) return; // Pastikan popup voucher sudah ditutup
      if (isAlertShown) return; // Jangan panggil Swal berulang
      if (!user) return; // User harus sudah login

      const alertShow = sessionStorage.getItem("shipmentAlertShow");
      if (alertShow) return; // Kalau sudah pernah muncul, skip

      // Cek ada pesanan dengan status 'dikirim'
      const adaYangDikirim = orders.some(
        (order) => order.shipment_status === "dikirim"
      );
      if (!adaYangDikirim) return;

      setIsAlertShown(true); // Tandai alert sudah mulai tampil

      // Tampilkan alert, tunggu user klik "Oke"
      await Swal.fire({
        title: "Pesanan dalam perjalanan!",
        html: `Kamu punya <strong>${dikirimCount}</strong> pesanan yang sudah dikirim. Klik <em>'Pesanan Diterima'</em> jika barang sudah sampai.`,
        icon: "info",
        confirmButtonText: "Oke",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      sessionStorage.setItem("shipmentAlertShow", "true");
      window.location.href = "/my-order";
    };

    showShipmentAlert();
  }, [orders, isPopupClosed, user, isAlertShown]);

  // Filter best sellers
  const bestSellers = useMemo(
    () => products.filter((product) => product.terjual > 2),
    [products]
  );

  // Batasi tampilan menjadi 4 produk
  const displayedBestSellers = useMemo(
    () => bestSellers.slice(0, 4),
    [bestSellers]
  );

  const displayedProducts = useMemo(() => products.slice(0, 4), [products]);

  if (loadingShip) {
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
    <div
      className={`${
        isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
      } pt-16 sm:pt-24 overflow-x-hidden w-full min-h-screen`}
    >
      {!isPopupClosed && (
        <PopupVoucher onClose={() => setIsPopupClosed(true)} />
      )}
      <NavbarComponent />
      <div className="p-4">
        <Banner />
        <SearchBar />
        {/* Kategori */}
        <div className="w-full">
          <div className="mx-auto">
            <h2
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
              } text-xl font-bold mb-4`}
            >
              Kategori
            </h2>
            <Category />
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="w-full">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-xl font-bold`}
              >
                Paling Laris
              </h2>
              <button type="button" className="cursor-pointer">
                <span className="text-xl text-[#28a154] font-medium">
                  <Link to="/best-sellers">Lihat Semua</Link>
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonListProduct key={index} />
                  ))
                : displayedBestSellers.map((product) => (
                    <CardProduct
                      key={product.id}
                      {...product}
                      isDarkMode={isDarkMode}
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* All Products Section */}
        <div className="w-full mt-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-xl font-bold`}
              >
                Semua Produk
              </h2>
              <button type="button" className="cursor-pointer">
                <span className="text-xl text-[#28a154] font-medium">
                  <Link to="/all-product">Lihat Semua</Link>
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonListProduct key={index} />
                  ))
                : displayedProducts.map((product) => (
                    <CardProduct
                      key={product.id}
                      {...product}
                      isDarkMode={isDarkMode}
                    />
                  ))}
            </div>
          </div>
        </div>
        <Payment />
      </div>
      <Footer />
      <Copyright />
    </div>
  );
};

export default HomePage;
