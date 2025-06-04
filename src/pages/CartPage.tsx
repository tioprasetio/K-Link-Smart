import { useState } from "react";
import { useCart } from "../context/CartContext";
import NavbarComponent from "../components/Navbar";
import { formatRupiah } from "../utils/formatCurrency";
import { useDarkMode } from "../context/DarkMode";
import { useNavigate } from "react-router"; // Untuk pindah ke halaman checkout
import Btn from "../components/Btn";
import Swal from "sweetalert2";
import { useCheckout } from "../context/CheckoutContext";

const CartPage = () => {
  const { isDarkMode } = useDarkMode();
  const { cart, addToCart, decreaseQuantity, removeFromCart, fetchCart } =
    useCart(); // Gunakan fungsi dari useCart
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Simpan item yang dicentang
  const { setSelectedProducts } = useCheckout(); // Ambil function dari context
  const navigate = useNavigate(); // Untuk pindah ke halaman checkout

  const [checkoutToken] = useState<string | null>(null);

  // Fungsi untuk toggle checkbox
  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]); // Uncheck semua
    } else {
      setSelectedItems(cart.map((item) => item.id)); // Pilih semua
    }
  };

  // Fungsi untuk mengurangi quantity
  const handleDecreaseQuantity = async (id: number, productId: number) => {
    const item = cart.find((item) => item.id === id);

    if (item && item.quantity === 1) {
      Swal.fire({
        title: "Hapus Produk?",
        text: "Ingin menghapus produk dari keranjang?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removeFromCart(id); // Hapus item dari keranjang
          await fetchCart(); // Refresh data keranjang
          Swal.fire(
            "Dihapus!",
            "Produk telah dihapus dari keranjang.",
            "success"
          );
        }
      });
    } else {
      await decreaseQuantity(productId, 1); // Kurangi quantity
      await fetchCart(); // Refresh data keranjang
    }
  };

  // Fungsi untuk menambah quantity
  const handleIncreaseQuantity = async (productId: number) => {
    // Cari data produk dari cart
    const product = cart.find((item) => item.product_id === productId);

    if (!product) {
      console.error("Produk tidak ditemukan di keranjang");
      return;
    }

    // Validasi apakah quantity saat ini + 1 melebihi stok
    if (product.quantity + 1 > product.stock) {
      Swal.fire({
        title: "Stok Tidak Cukup",
        text: "Jumlah yang ingin Anda beli melebihi stok yang tersedia.",
        icon: "warning",
      });
      return;
    }

    // Jika valid, tambahkan quantity
    await addToCart(productId, 1, product.variant);
    await fetchCart();
  };

  // Hitung total harga dari item yang dipilih
  const totalHarga = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.harga * item.quantity, 0);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalBV = cart
    .filter((item) => selectedItems.includes(item.id)) // Ambil hanya item yang dipilih
    .reduce((total, item) => total + item.bv * item.quantity, 0);

  const handleCheckout = () => {
    const selectedItemsData = cart.filter((item) =>
      selectedItems.includes(item.id)
    );

    console.log("Test Token:", checkoutToken);

    if (selectedItemsData.length === 0) {
      Swal.fire(
        "Oops!",
        "Pilih minimal satu produk untuk checkout.",
        "warning"
      );
      return;
    }

    const outOfStockItems = selectedItemsData.filter((item) => item.stock <= 0);

    if (outOfStockItems.length > 0) {
      const productList = outOfStockItems
        .map((item) => `• ${item.name} (Stok habis)`)
        .join("<br>");
      Swal.fire({
        icon: "error",
        title: "Stok Kosong!",
        html: `Produk berikut stoknya habis:<br><br>${productList}`,
      });
      return;
    }

    setSelectedProducts(selectedItemsData); // Simpan data ke context
    navigate("/checkout"); // Pindah ke halaman checkout
  };

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode
            ? "bg-[#140c00] text-[#f0f0f0]"
            : "bg-[#f4f6f9] text-[#353535]"
        } p-6 pt-24 pb-48 w-full h-full`}
      >
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bx bx-arrow-back text-xl md:text-2xl cursor-pointer"
            onClick={() => navigate("/")}
          ></i>
          <h1 className="text-2xl font-bold">Keranjang Saya</h1>
          {totalItems > 0 ? (
            <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {totalItems}
            </span>
          ) : (
            ""
          )}
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/428/428173.png"
              alt=""
            />
            <p
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#959595]"
              } text-center text-lg font-semibold`}
            >
              Keranjang masih kosong
            </p>
            <p
              className={`${
                isDarkMode ? "text-[#f0f0f0]" : "text-[#959595]"
              } text-center text-base font-normal`}
            >
              Simpan barang yang kamu ingin beli disini
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className={`${
                isDarkMode
                  ? "bg-[#404040] text-[#f0f0f0]"
                  : "bg-[#FFFFFF] text-[#353535]"
              } p-3 rounded-lg flex items-center mt-4`}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="mr-3 h-5 w-5 text-green-600 accent-green-600 rounded cursor-pointer"
              />
              <a className="inline-block" href="#">
                <img
                  src={`${import.meta.env.VITE_API_URL}/storage/${
                    item.picture
                  }`}
                  alt={item.name}
                  className="h-16 w-16 mr-2 object-cover rounded-md"
                  width={800}
                  height={800}
                />
              </a>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <a
                      className="inline-block font-medium w-32 md:w-64 truncate"
                      href="#"
                    >
                      {item.name}
                    </a>
                    <a className="inline-block font-semibold" href="#">
                      BV: {item.bv * item.quantity}
                    </a>
                    {item.variant && (
                      <p
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } text-sm`}
                      >
                        Varian: {item.variant}
                      </p>
                    )}

                    <a className="inline-block font-semibold" href="#">
                      {formatRupiah(item.harga * item.quantity)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleDecreaseQuantity(item.id, item.product_id)
                      }
                      className="text-gray-400 dark:text-gray-300 cursor-pointer"
                    >
                      <i className="bx bx-minus-circle text-2xl"></i>
                    </button>
                    <span className="text-base font-semibold text-center w-6">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncreaseQuantity(item.product_id)}
                      className="text-gray-400 dark:text-gray-300 cursor-pointer"
                    >
                      <i className="bx bx-plus-circle text-2xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Tombol Checkout */}
        <div
          className={`${
            isDarkMode
              ? "bg-[#404040] text-[#f0f0f0]"
              : "bg-[#FFFFFF] text-[#353535]"
          } fixed bottom-0 left-0 w-full p-4 shadow-xl flex flex-col gap-2`}
        >
          {/* Bagian Atas: Checkbox Pilih Semua & Total Harga */}
          <div className="flex justify-between items-center">
            {/* Checkbox Pilih Semua */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-5 w-5 text-green-600 accent-green-600 rounded cursor-pointer"
                checked={
                  selectedItems.length === cart.length && cart.length > 0
                }
                onChange={toggleSelectAll}
              />
              <p className="text-sm font-medium">Semua</p>
            </div>

            {/* Total Harga */}
            <div className="flex flex-col gap-2">
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-base font-semibold`}
              >
                Total: {formatRupiah(totalHarga)}
              </h2>
              <h2
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-base font-semibold`}
              >
                BV Didapat: {totalBV}
              </h2>
            </div>
          </div>

          {/* Tombol Checkout di Bawah */}
          <Btn
            onClick={handleCheckout}
            className={`${
              selectedItems.length === 0
                ? "bg-[#28a154] text-white cursor-not-allowed"
                : "bg-[#28a154] text-white"
            } px-4 py-2 font-semibold rounded w-full`}
            disabled={selectedItems.length === 0}
          >
            Checkout ({selectedItems.length})
          </Btn>
        </div>
      </div>
    </>
  );
};

export default CartPage;
