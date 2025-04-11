import { useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";

const AboutUsPage = () => {
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
          <h1 className="text-2xl font-bold text-[#28a154]">Tentang Kami</h1>
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
            <b>
              K-Link Nusantara merupakan perusahaan Digital Network Marketing
              pertama di Indonesia yang berbasis syariah.
            </b>
          </p>
          <p>
            Kami memberikan peluang bisnis online maupun offline dengan produk
            kesehatan, kecantikan dan rumah tangga. Mengikuti kemajuan
            teknologi, kami tidak hanya memiliki puluhan stokis yang tersebar di
            Indonesia namun juga menyediakan platform resmi k-net.co.id dan
            dnmmobile.com dalam memudahkan mitra untuk mendapatkan produk.
            Inilah beberapa alasan mengapa K-Link Nusantara diterima banyak
            orang.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
