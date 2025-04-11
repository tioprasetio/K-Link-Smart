import { Link } from "react-router";
import { useDarkMode } from "../context/DarkMode";

const Footer = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <>
      {/* <!-- Footer Info --> */}
      <div className="p-6 w-full">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* <!-- Footer Kontak --> */}
            <div
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
              } pb-6 py-6 pr-6`}
            >
              <h2 className="mb-4 font-bold text-xl text-[#28a154]">
                Kontak Pengaduan Pelanggan
              </h2>
              <div className="flex mb-4">
                <div className="footer-text">
                  K-Link Tower, Jalan Gatot Subroto Kav. 59A, Jakarta Selatan
                  12950, Indonesia.
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <h3 className="font-medium">Working Hours:</h3>
                <div className="footer-text">
                  Senin - Jum'at: 09:00 - 17:00 Wib
                </div>
              </div>
              <div className="flex mb-4 gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{
                    fill: isDarkMode ? "white" : "rgba(84, 93, 105, 1)",
                  }}
                >
                  <path d="m18.73 5.41-1.28 1L12 10.46 6.55 6.37l-1.28-1A2 2 0 0 0 2 7.05v11.59A1.36 1.36 0 0 0 3.36 20h3.19v-7.72L12 16.37l5.45-4.09V20h3.19A1.36 1.36 0 0 0 22 18.64V7.05a2 2 0 0 0-3.27-1.64z"></path>
                </svg>
                <div className="footer-text">customer_service@k-link.co.id</div>
              </div>
              <div className="flex mb-4 gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{
                    fill: isDarkMode ? "white" : "rgba(84, 93, 105, 1)",
                  }}
                >
                  <path d="m20.487 17.14-4.065-3.696a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.085-1.39z"></path>
                </svg>
                <div className="footer-text">0812-1011-1511</div>
              </div>
            </div>

            {/* <!-- Footer Tentang K-Link --> */}
            <div
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
              } pb-6 py-6 pr-6`}
            >
              <h2 className="mb-4 font-bold text-xl text-[#28a154]">
                Tentang K-Link
              </h2>
              <ul>
                <li className="mb-2">
                  <Link to="/about-us">Tentang Kami</Link>
                </li>
                <li className="mb-2">
                  <Link to="/why">Kenapa Harus K-Link</Link>
                </li>
                <li className="mb-2">
                  <Link to="/shipping-rate">Biaya Kirim</Link>
                </li>
                <li className="mb-2">
                  <Link to="/replacement">Penggantian</Link>
                </li>
                <li className="mb-2">
                  <Link to="/delivery">Pengiriman</Link>
                </li>
                <li className="mb-2">
                  <Link to="/privacy-policy">Kebijakan Privasi</Link>
                </li>
              </ul>
            </div>

            {/* <!-- Footer Bantuan Untuk Anda --> */}
            <div
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
              } pb-6 py-6 pr-6`}
            >
              <h2 className="mb-4 font-bold text-xl text-[#28a154]">
                Bantuan Untuk Anda
              </h2>
              <ul>
                <li className="mb-2">
                  <Link to="/how-to-order">Cara Belanja</Link>
                </li>
                <li className="mb-2">
                  <Link to="/cart">Keranjang Belanja</Link>
                </li>
                <li className="mb-2">
                  <Link to="/profile">Akun Saya</Link>
                </li>
              </ul>
            </div>

            {/* <!-- Footer Pembayaran --> */}
            {/* <div className="pb-6 py-6 pr-6">
              <h2 className="mb-4 font-bold text-xl text-[#28a154]">
                Pembayaran
              </h2>
              <div className="flex mb-4">
                <img
                  src="https://k-net.co.id/assets/images/secure.png"
                  alt=""
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
