import Swal from "sweetalert2";
import { useCheckout } from "../context/CheckoutContext";
import { formatRupiah } from "../utils/formatCurrency";
import Btn from "../components/Btn";
import { Link, useNavigate } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface ShippingMethod {
  name: string;
  price: number;
}

const CheckoutPage = () => {
  const { selectedProducts, setSelectedProducts } = useCheckout();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);

  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(
    null
  );

  const { user } = useAuth();

  if (selectedProducts.length === 0) {
    navigate("/cart");
  }

  // Fungsi untuk menerapkan voucher dari database
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      Swal.fire("Error", "Masukkan kode voucher!", "error");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/vouchers/${voucherCode}`
      );

      if (response.data.valid) {
        setDiscount(response.data.discount);
        Swal.fire(
          "Success",
          `Voucher berhasil digunakan! Diskon ${response.data.discount}%`,
          "success"
        );
      } else {
        Swal.fire(
          "Error",
          "Voucher tidak valid atau sudah digunakan!",
          "error"
        );
      }
    } catch (error) {
      console.error("Error checking voucher:", error);
      Swal.fire("Error", "Terjadi kesalahan saat memeriksa voucher!", "error");
    }
  };

  // Fungsi untuk membatalkan checkout
  const handleCancelCheckout = () => {
    Swal.fire({
      title: "Batalkan Checkout?",
      text: "Apakah Anda yakin ingin membatalkan checkout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("selectedProducts");
        setSelectedProducts([]);
        Swal.fire("Dibatalkan!", "Checkout telah dibatalkan.", "success");
        navigate("/cart");
      }
    });
  };

  // Ambil metode pengiriman dari API Express
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/method-shipping"
        );

        setMethods(response.data);
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
      }
    };

    fetchShippingMethods();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const totalHarga =
    selectedProducts.reduce(
      (total, item) => total + item.harga * item.quantity,
      0
    ) *
      (1 - discount / 100) +
    (selectedMethod?.price || 0);

  // Hitung total BV
  const totalBV = selectedProducts.reduce(
    (total, item) => total + item.bv * item.quantity,
    0
  );

  const handleSelectMethod = (method: ShippingMethod) => {
    setSelectedMethod(method);
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
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-[#140C00] text-[#FFFFFF]"
          : "bg-[#f4f6f9] text-[#353535]"
      } p-6 mb-16 w-full min-h-screen pb-20`}
    >
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Informasi Pengguna */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg`}
      >
        {user ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p className="text-sm">({user.no_hp})</p>
              </div>
              <Link
                to="/edit-profile"
                className={`py-2 px-4 rounded cursor-pointer text-3xl items-center justify-center ${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#959595]"
                }`}
              >
                <i className="bx bx-right-arrow-circle"></i>
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-sm">{user.alamat}</p>
            </div>
          </>
        ) : (
          <p>Memuat data pengguna...</p>
        )}
      </div>

      {/* Informasi Produk */}
      {selectedProducts.length === 0 ? (
        <p>Memuat data pengguna...</p>
      ) : (
        <div className="space-y-4">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className={`${
                isDarkMode
                  ? "bg-[#404040] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] text-[#353535]"
              } p-4 rounded-lg flex items-center mt-4`}
            >
              <img
                src={product.picture}
                alt={product.name}
                className="h-16 w-16 mr-4 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="font-semibold">{formatRupiah(product.harga)}</p>
                <p>Jumlah: {product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voucher */}
      <div className="mt-4 p-4 bg-white rounded-lg">
        <h3 className="font-bold mb-2">Gunakan Voucher</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Masukkan kode voucher"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleApplyVoucher}
            className="bg-green-500 text-white p-2 rounded"
          >
            Gunakan
          </button>
        </div>
      </div>

      {/* Metode Pengiriman */}
      <div className="mt-4 p-4 bg-white rounded-lg">
        <h3 className="font-bold mb-2">Pilih Metode Pengiriman</h3>
        {methods.length === 0 ? (
          <p>Memuat metode pengiriman...</p>
        ) : (
          <select
            value={selectedMethod?.name || ""}
            onChange={(e) => {
              const selected = methods.find((m) => m.name === e.target.value);
              if (selected) handleSelectMethod(selected);
            }}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>
              Pilih metode pengiriman
            </option>
            {methods.map((method, index) => (
              <option key={index} value={method.name}>
                {method.name} - {formatRupiah(method.price)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Rincian Pembayaran */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } p-4 rounded-lg flex mt-4 flex-col gap-2`}
      >
        <div className="flex justify-between">
          <p className="font-medium">Total BV didapat</p>
          <p className="font-medium">{totalBV}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Subtotal untuk produk</p>
          <p className="font-medium">{formatRupiah(totalHarga)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Subtotal pengiriman</p>
          <p className="font-medium">
            {formatRupiah(selectedMethod?.price || 0)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Voucher Diskon</p>
          <p className="font-medium">{discount}%</p>
        </div>
        <hr className="border-t border-gray-300" />
        <div className="flex justify-between">
          <p className="font-semibold">Total Pembayaran</p>
          <p className="font-semibold">{formatRupiah(totalHarga)}</p>
        </div>
      </div>

      {/* Tombol Bayar & Batal */}
      <div
        className={`${
          isDarkMode
            ? "bg-[#404040] text-[#FFFFFF]"
            : "bg-[#FFFFFF] text-[#353535]"
        } fixed bottom-0 left-0 w-full p-4 shadow-xl flex flex-col gap-2`}
      >
        <h2 className="text-lg font-semibold">
          Total: {formatRupiah(totalHarga)}
        </h2>
        <div className="flex gap-2">
          <Btn
            onClick={handleCancelCheckout}
            className={`${
              isDarkMode
                ? "bg-[#cb2525] text-[#f0f0f0]"
                : "bg-[#cb2525] text-[#f0f0f0]"
            } px-4 py-2 font-semibold rounded w-1/2`}
          >
            Batal
          </Btn>
          <Btn
            className={`${
              isDarkMode
                ? "bg-[#28a154] text-[#f0f0f0]"
                : "bg-[#28a154] text-[#f0f0f0]"
            } px-4 py-2 font-semibold rounded w-1/2`}
          >
            Bayar Sekarang
          </Btn>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
