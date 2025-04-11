import { useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";

const DeliveryPage = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
      } pt-16 sm:pt-24 overflow-x-hidden w-full min-h-screen`}
    >
      <NavbarComponent />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl text-[#28a154] md:text-2xl cursor-pointer"
            onClick={() => navigate(-1)} // Tambahkan fungsi kembali
          ></i>
          <h1 className="text-2xl font-bold text-[#28a154]">Delivery</h1>
        </div>
        <div
          className={`${
            isDarkMode
              ? "bg-[#303030] text-[#f0f0f0]"
              : "bg-[#ffffff] text-[#353535]"
          } rounded-lg p-6 flex flex-col text-justify items-start gap-4 shadow-md mt-4`}
        >
          <img
            src="https://k-net.co.id/assets/images/logo.png"
            alt="logo"
            className="max-w-full mx-auto"
            loading="lazy"
          />
          <p>
            Pengiriman barang yang sudah di pesan akan dikirim melalui kurir
            yang telah bekerja sama dengan Pihak K-Link Indonesia.
          </p>
          <p>
            Proses pengiriman barang dibutuhkan waktu berkisar 3 sd 4 hari kerja
            tergantung kondisi lokasi tujuan pengiriman barang. Wilayah cakupan
            pengiriman adalah sekitar area service dari stockist K-LINK yang
            Anda pilih dan tidak dapat keluar dari kota dimana stockist tersebut
            berada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
