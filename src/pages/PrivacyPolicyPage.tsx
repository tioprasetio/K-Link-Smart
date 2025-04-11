import { useNavigate } from "react-router";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";

const PrivacyPolicyPage = () => {
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
          <h1 className="text-2xl font-bold text-[#28a154]">Privacy Policy</h1>
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
          <h1 className="text-2xl font-semibold">
            MELINDUNGI DATA PRIBADI ANDA
          </h1>
          <h1 className="text-2xl font-semibold">Keamanan Data</h1>
          <p>
            Kerahasiaan Data Pribadi Anda adalah hal yang terpenting bagi Kami.
            Kami akan memberlakukan upaya terbaik untuk melindungi dan
            mengamankan Data Pribadi Anda dari akses, pengumpulan, penggunaan
            atau pengungkapan oleh orang-orang yang tidak berwenang dan dari
            pengolahan yang bertentangan dengan hukum, kehilangan yang tidak
            disengaja, pemusnahan dan kerusakan atau risiko serupa. Namun,
            dikarenakan pengiriman data melalui internet tidak sepenuhnya aman,
            Kami tidak dapat sepenuhnya menjamin bahwa Data Pribadi tersebut
            tidak akan dicegat, diakses, diungkapkan, diubah atau dihancurkan
            oleh pihak ketiga yang tidak berwenang, karena faktor-faktor di luar
            kendali Kami. Anda bertanggung jawab untuk menjaga kerahasiaan
            detail akun Anda dan wajib untuk tidak membagikan detail akun Anda,
            termasuk kata sandi Anda dengan siapapun, dan Anda juga harus selalu
            menjaga dan bertanggung jawab atas keamanan perangkat yang Anda
            gunakan.
          </p>

          <h1 className="text-2xl font-semibold">Penyimpanan Data</h1>
          <p>
            Data Pribadi Anda hanya akan disimpan selama diperlukan untuk
            memenuhi tujuan dari pengumpulannya, selama masa retensi atau selama
            penyimpanan tersebut diperlukan atau diperbolehkan oleh Peraturan
            Perundang-undangan yang Berlaku. Kami akan berhenti menyimpan Data
            Pribadi, atau menghapus maksud dari dikaitkannya Data Pribadi
            tersebut dengan Anda sebagai individu, segera setelah dianggap bahwa
            tujuan pengumpulan Data Pribadi tersebut tidak lagi dibutuhkan
            dengan menyimpan Data Pribadi, terdapat permintaan dari Anda untuk
            melakukan penghapusan akun Anda, dan penyimpanan tidak lagi
            diperlukan untuk tujuan bisnis atau secara hukum.
          </p>
          <p>
            K-Link akan menghapus dan/atau menganonimkan Data Pribadi Pengguna
            yang ada di bawah kendali K-Link apabila (i) Data Pribadi Pengguna
            tidak lagi diperlukan untuk memenuhi tujuan dari pengumpulannya;
            (ii) berakhirnya masa retensi dan (iii) penyimpanan tidak lagi
            diperlukan untuk tujuan kepatuhan menurut ketentuan peraturan
            perundang-undangan yang berlaku.
          </p>
          <p>
            Mohon diperhatikan bahwa masih ada kemungkinan bahwa beberapa Data
            Pribadi Anda disimpan atau dikuasai oleh pihak lain termasuk
            institusi pemerintah dengan cara tertentu. Dalam hal Kami membagikan
            Data Pribadi Anda kepada institusi pemerintah yang berwenang
            dan/atau institusi lainnya yang dapat ditunjuk oleh pemerintah yang
            berwenang atau memiliki kerja sama dengan Kami, Anda menyetujui dan
            mengakui bahwa penyimpanan Data Pribadi Anda oleh institusi terkait
            akan mengikuti kebijakan penyimpanan data masing-masing institusi
            tersebut.
          </p>
          <p>
            Data yang disampaikan melalui komunikasi antara Pembeli dan Penjual
            yang dilakukan selain melalui penggunaan Aplikasi (seperti melalui
            panggilan telepon, SMS, pesan seluler atau cara komunikasi lainnya
            dan pengumpulan atas Data Pribadi Anda oleh agen Kami) juga dapat
            disimpan dengan beberapa cara. Kami tidak mengizinkan Pemrosesan
            Data Pribadi antara Pembeli dan Penjual yang terjadi diluar Aplikasi
            Kami. Oleh karena itu, Pembeli dan Penjual bertanggung jawab penuh
            terhadap Pemrosesan Data Pribadi tersebut.
          </p>
          <p>
            Sepanjang diizinkan oleh Peraturan Perundang-undangan yang Berlaku,
            Anda membebaskan Kami dari dan terhadap setiap dan segala klaim,
            kerugian, kewajiban, biaya, kerusakan, dan ongkos (termasuk tetapi
            tidak terbatas pada biaya hukum dan pengeluaran biaya ganti rugi
            penuh) yang dihasilkan secara langsung atau tidak langsung dari
            setiap aktivitas yang dilakukan diluar Aplikasi kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
