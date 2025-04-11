import { useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";

const ShippingRatePage = () => {
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
          <h1 className="text-2xl font-bold text-[#28a154]">Biaya Kirim</h1>
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
            Jika memilih pengiriman ke alamat pribadi maka biaya pengiriman akan
            dibebankan kepada pembeli, sesuai dengan berat / volume barang serta
            jarak dari stockist ke alamat pribadi Anda.
          </p>
          <ol className="list-decimal pl-6 w-full text-left">
            <li>Tentukan Area Stockist, contoh; Jawa Tengah, Jawa Barat.</li>
            <li>Pilih stockist yang Anda inginkan</li>
            <li>
              Penentuan Volume / Berat secara otomatis dihitung oleh sistem
            </li>
            <li>Masukan alamat pengiriman kota serta Wilayah</li>
            <li>Secara otomatis biaya pengiriman akan dikalkulasikan</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ShippingRatePage;
