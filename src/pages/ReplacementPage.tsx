import { useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";

const ReplacemenetPage = () => {
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
          <h1 className="text-2xl font-bold text-[#28a154]">Replacement</h1>
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
            Ada beberapa hal yang bisa mengakibatkan penukaran barang terjadi.
            Apabila terjadi proses penukaran barang, Anda harus memenuhi
            kriteria berikut ini:
          </p>
          <ol className="list-decimal pl-6 w-full text-left">
            <li>
              Jika mendapatkan barang yang telah Anda order melalui website ini
              berbeda dengan barang yang Anda terima, maka Anda diwajibkan untuk
              mengisi form secara online atau menghubungi stockist dimana Anda
              melakukan transaksi.
            </li>
            <li>
              Jika barang yang Anda order rusak pada saat proses pengiriman,
              Anda dapat melakukan klaim ke stockist dengan syarat transaksi
              tersebut dilindungi dengan asuransi.
            </li>
            <li>
              Pengisian form kerusakan barang wajib dilengkapi jika Anda
              melakukan proses retur selama memenuhi poin 1 & 2.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ReplacemenetPage;
