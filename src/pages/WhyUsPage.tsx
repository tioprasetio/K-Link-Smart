import { useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";

const WhyUsPage = () => {
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
          <h1 className="text-2xl font-bold text-[#28a154]">
            Kenapa Harus K-Link?
          </h1>
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
            K-Link saat ini telah menjadi salah satu penjual langsung terbesar
            di Indonesia, sehingga dengan menjadi distributor K-Link berarti
            anda menjual merek nasional yang mapan dan terpercaya di seluruh
            negeri ini. Pengalaman kami dalam industri penjualan langsung
            memberikan jaminan bahwa kami adalah pilihan yang tepat.
          </p>
          <p>
            Setiap anggota memiliki upline yang akan memberikan pendampingan,
            pelatihan dan mendukung setiap langkah anda menuju sukses dengan
            kami. Modul pelatihan standar kami dijelaskan secara sederhana,
            mudah dipelajari dan dimengerti, serta mudah dilakukan dan
            diajarkan.
          </p>
          <p>
            Rencana pemasaran (Marketing Plan) kami sangat bermanfaat dalam
            menguraikan potensi yang ditawarkan kepada seluruh Distributor
            K-link. Tidak hanya distributor mendapatkan uang dari penjualan
            produk, mereka juga menerima pembayaran bonus dari jumlah point BV
            (Business Value/Nilai Bisnis) yang diperoleh melalui penjualan itu.
            Selain PBV yang merupakan penjualan pribadi dari distributor itu
            sendiri, ada juga PGBV (Personal Group Business Value/Nilai Bisnis
            Grup Personal), yang merupakan pembayaran bonus berdasarkan
            persentasi penjualan jaringan distributor tersebut. Maka, semakin
            besar jaringan distributornya, semakin besar pula pembayaran
            bonusnya, hal ini membuka kesempatan mendapatkan penghasilan yang
            benar-benar tak terbatas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyUsPage;
