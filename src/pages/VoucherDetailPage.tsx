import { useLocation, useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import Btn from "../components/Btn";
import { useState } from "react";
import PromoProduct from "../components/PromoProduct";
import useVouchers from "../context/VoucherContext";

const VoucherDetailPage = () => {
  const { isDarkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useVouchers();

  const voucher = location.state;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(voucher.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset status setelah 2 detik
      })
      .catch((err) => {
        console.error("Gagal menyalin kode:", err);
      });
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
        <div className="loader"></div> {/* Tambahkan animasi spinner di sini */}
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
        } p-6 pt-24 pb-8 w-full min-h-screen`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className={`${
              isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
            } bx bx-arrow-back text-xl md:text-2xl cursor-pointer`}
            onClick={() => navigate(-1)} // Tambahkan fungsi kembali
          ></i>
          <h1
            className={`${
              isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
            } text-2xl font-bold`}
          >
            Detail Voucher
          </h1>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#303030] text-[#f0f0f0]"
              : "bg-[#ffffff] text-[#353535]"
          } rounded-lg p-6 flex flex-col gap-4 shadow-md mt-4`}
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/storage/${voucher.picture}`}
            alt="logo"
            className="max-w-100% rounded-lg"
            loading="lazy"
          />
          <h1 className="text-2xl font-bold">Syarat dan Ketentuan</h1>
          <ul>
            <li>Voucher berlaku untuk customer K-Smart</li>
            <li>Tanpa minimum transaksi</li>
            <li>Pembelian produk apapun diskon {voucher.discount}%</li>
          </ul>
        </div>

        <div
          className={`${
            isDarkMode
              ? "bg-[#303030] text-[#f0f0f0]"
              : "bg-[#ffffff] text-[#353535]"
          } rounded-lg p-6 flex flex-col gap-4 shadow-md mt-4 mb-6`}
        >
          <h1 className="text-2xl font-bold">Detail Voucher</h1>
          <hr className="border-t border-gray-300" />

          <div className="flex flex-col">
            <h1 className="font-bold text-base">
              <i className="bx bx-calendar"></i> Kode Voucher
            </h1>
            <p
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#959595]"
              } text-xl font-medium`}
            >
              {voucher.code}
            </p>
            <Btn className="gap-2" onClick={handleCopy}>
              <i className="bx bx-copy"></i>
              {copied ? "Kode Disalin!" : "Salin kode promo"}
            </Btn>
          </div>
        </div>

        <h1 className="text-xl font-bold mb-4">Rekomendasi Voucher</h1>
        <PromoProduct />
      </div>
    </>
  );
};

export default VoucherDetailPage;
