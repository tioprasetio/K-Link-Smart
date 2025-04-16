// pages/ProductDetailPage.tsx
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDarkMode } from "../context/DarkMode";
import Swal from "sweetalert2";
import Btn from "../components/Btn";
import { formatRupiah } from "../utils/formatCurrency";
import { Product } from "../types/Product";
import useProducts from "../context/ProductContext";
import Chatbot from "../components/Chatbot";
import PromoProduct from "../components/PromoProduct";
import NavbarComponent from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCheckout } from "../context/CheckoutContext";

const ProductDetailPage = () => {
  const { addToCart, cart } = useCart();
  const { productSlug } = useParams<{ productSlug: string }>(); // Ambil productSlug dari URL
  const navigate = useNavigate();
  const { products, loading, error } = useProducts(); // Ambil data produk dari custom hook
  const { isDarkMode } = useDarkMode();
  const { isLoggedIn } = useAuth();
  const { setSelectedProducts } = useCheckout();

  const [quantity, setQuantity] = useState(1); // State untuk kuantitas produk
  const [product, setProduct] = useState<Product | null>(null); // State untuk menyimpan produk yang dipilih

  // Ekstrak ID dari productSlug
  const productId = productSlug ? parseInt(productSlug.split("-")[0]) : null;

  // Cari produk berdasarkan ID
  useEffect(() => {
    if (products.length > 0 && productId) {
      const foundProduct = products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        Swal.fire({
          title: "Oops...",
          text: "Produk tidak ditemukan!",
          icon: "error",
        }).then(() => navigate("/")); // Redirect ke halaman utama jika produk tidak ditemukan
      }
    }
  }, [products, productId, navigate]);

  // Fungsi untuk menambah kuantitas
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else if (product) {
      Swal.fire({
        title: "Stok Tidak Cukup",
        text: `Jumlah yang Anda pilih melebihi stok tersedia (${product.stock} pcs).`,
        icon: "warning",
      });
    }
  };

  // Fungsi untuk mengurangi kuantitas
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Updated handleAddToCart function in ProductDetailPage.tsx
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Oops...",
        text: "Anda harus login terlebih dahulu!",
        icon: "error",
      });
      navigate("/login");
      return;
    }

    if (product) {
      if (quantity > product.stock) {
        Swal.fire({
          title: "Stok Tidak Cukup",
          text: `Jumlah yang Anda pilih melebihi stok tersedia (${product.stock} pcs).`,
          icon: "warning",
        });
        return;
      }

      // Check if the product is already in the cart
      const existingCartItem = cart.find(
        (item) => item.product_id === product.id
      );
      const totalQuantity = existingCartItem
        ? existingCartItem.quantity + quantity
        : quantity;

      // Check if total quantity exceeds stock
      if (totalQuantity > product.stock) {
        Swal.fire({
          title: "Stok Tidak Cukup",
          text: `Total item di keranjang akan melebihi stok tersedia (${product.stock} pcs).`,
          icon: "warning",
        });
        return;
      }

      try {
        await addToCart(product.id, quantity);

        Swal.fire({
          title: "Berhasil!",
          text: "Produk telah ditambahkan ke keranjang.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/cart");
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Oops...",
          text: "Gagal menambahkan produk ke keranjang.",
          icon: "error",
        });
      }
    }
  };

  // Fungsi untuk membeli produk langsung
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Oops...",
        text: "Anda harus login terlebih dahulu!",
        icon: "error",
      });
      navigate("/login");
      return;
    }

    if (product) {
      if (quantity > product.stock) {
        Swal.fire({
          title: "Stok Tidak Cukup",
          text: `Jumlah yang Anda pilih melebihi stok tersedia (${product.stock} pcs).`,
          icon: "warning",
        });
        return;
      }

      const productToCheckout = {
        id: product.id,
        product_id: product.id,
        name: product.name,
        picture: product.picture,
        harga: product.harga,
        stock: product.stock,
        quantity: quantity,
        bv: product.bv,
        beratPengiriman: product.beratPengiriman,
      };

      setSelectedProducts([productToCheckout]);
      navigate("/checkout");
    }
  };

  // Tampilkan loading jika data sedang dimuat
  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex justify-center items-center min-h-screen`}
      >
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Memuat produk...
        </p>
      </div>
    );
  }

  // Tampilkan error jika terjadi kesalahan
  if (error) {
    return <p>{error}</p>;
  }

  // Tampilkan pesan jika produk tidak ditemukan
  if (!product) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-[#140C00]" : "bg-[#f4f6f9]"
        } flex justify-center items-center min-h-screen`}
      >
        <p className={`${isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"}`}>
          Produk tidak ditemukan
        </p>
      </div>
    );
  }

  return (
    <>
      <NavbarComponent />
      <div
        className={`${
          isDarkMode ? "bg-[#140c00]" : "bg-[#f4f6f9]"
        } p-6 pt-24 sm:pt-28 pb-24 sm:pb-28 w-full min-h-screen`}
      >
        {/* Tampilan detail produk */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 xl:gap-4 md:pt-5">
            {/* Gambar Produk */}
            <div className="flex flex-col">
              <section className="bg-[#ffffff] rounded-lg p-4 mb-3 xl:mb-4">
                <img
                  src={`${import.meta.env.VITE_API_URL}/storage/${
                    product.picture
                  }`}
                  alt={product.name}
                  className="w-full object-cover"
                  width={800}
                  height={800}
                />
              </section>

              {/* Informasi Produk */}
              <div className="hidden md:block">
                <section
                  className={`${
                    isDarkMode
                      ? "bg-[#303030] text-[#f0f0f0]"
                      : "bg-[#ffffff] text-[#353535]"
                  } rounded-lg p-4 mb-3 xl:mb-4`}
                >
                  <div className="p6">Informasi Produk</div>
                  <hr className="mt-4 border-t border-gray-300" />
                  <div className="flex items-center justify-between pt-4">
                    <div>BV</div>
                    <div>{product.bv} BV</div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div>Berat Pengiriman</div>
                    <div>{product.beratPengiriman} gr</div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div>Berat Bersih Satuan</div>
                    <div>{product.beratBersih} ml</div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div>Pemesanan Minimal</div>
                    <div>{product.pemesananMin} pcs</div>
                  </div>
                </section>

                <section
                  className={`${
                    isDarkMode
                      ? "bg-[#303030] text-[#f0f0f0]"
                      : "bg-[#ffffff] text-[#353535]"
                  } rounded-lg p-6 mb-3 xl:mb-4`}
                >
                  <h2 className="h3 pb-2">Jaminan Mutu</h2>
                  <div className="pt-4 flex items-center">
                    <i className="text-xl bx bx-check-circle text-[#28a154]"></i>
                    <div>100% Produk Original</div>
                    <button
                      type="button"
                      className="ml-auto text-xl text-primary"
                    >
                      <i className="text-xl bx bx-info-circle text-[#28a154]"></i>
                    </button>
                  </div>
                </section>
                <div
                  className={`${
                    isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
                  } fixed gap-4 bottom-0 left-0 w-full p-4 shadow-2xl flex justify-between items-center z-50`}
                >
                  <Btn
                    className="flex-1"
                    variant="outline"
                    onClick={handleAddToCart}
                  >
                    <i className="bx bx-cart-add text-lg"></i> Keranjang
                  </Btn>
                  <Btn className="flex-1" onClick={handleBuyNow}>
                    Beli Sekarang
                    <i className="bx bx-right-arrow-alt text-lg"></i>
                  </Btn>
                </div>
              </div>
            </div>

            {/* Informasi Produk Lanjutan */}
            <section className="rounded-lg">
              <div className="flex flex-col">
                <section
                  className={`${
                    isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
                  } p-6 mb-3 xl:mb-4 rounded-lg`}
                >
                  <h1
                    className={`${
                      isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                    } text-2xl font-semibold mb-2`}
                  >
                    {product.name}
                  </h1>
                  <div className="flex flex-row items-center">
                    <span className="text-[#959595] text-lg">
                      <i className="bx bxs-star text-lg text-[#FFD52DFF]"></i>
                      {product.rate}
                    </span>
                    <span className="text-[#959595] text-lg px-1">|</span>
                    <span className="text-[#959595] text-lg">
                      Terjual {product.terjual}
                    </span>
                  </div>

                  <div className="flex flex-row items-center mt-10">
                    <h1
                      className={`${
                        isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                      } text-3xl font-bold`}
                    >
                      {formatRupiah(product.harga)}
                    </h1>
                    <span
                      className={`${
                        isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                      } text-xl font-medium`}
                    >
                      &nbsp;/ pcs
                    </span>
                  </div>
                  <h1 className="text-[#959595] text-lg">
                    Stok barang {product.stock}
                  </h1>

                  <div className="flex items-center justify-between pt-4">
                    <h3
                      className={`${
                        isDarkMode ? "text-[#F0F0F0]" : "text-[#353535]"
                      } text-lg font-semibold `}
                    >
                      Kuantitas
                    </h3>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className={`focus:outline-none cursor-pointer text-gray-400 ${
                          quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={quantity === 1}
                      >
                        <i className="bx bx-minus-circle text-2xl"></i>
                      </button>
                      <input
                        type="text"
                        className={`${
                          isDarkMode
                            ? "text-[#F0F0F0] bg-[#303030]"
                            : "text-[#353535] bg-[#ffffff]"
                        } text-base font-semibold text-center focus:outline-none w-14 border-none`}
                        name="quantity"
                        id="quantity"
                        value={quantity}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={increaseQuantity}
                        className="focus:outline-none cursor-pointer"
                      >
                        <i className="bx bx-plus-circle text-2xl text-gray-400"></i>
                      </button>
                    </div>
                  </div>

                  <hr className="mt-4 border-t border-gray-300" />
                  <h3
                    className={`${
                      isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                    } mt-4 text-lg font-semibold`}
                  >
                    Isi Produk:
                  </h3>
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-[#404040] text-[#f0f0f0]"
                        : "bg-[#f4f6f9] text-[#353535]"
                    } p-3 rounded-lg flex rounded-t-lg mt-4 rounded-b-lg`}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${
                        product.picture
                      }`}
                      alt={product.name}
                      className="h-16 w-16 mr-2 object-cover rounded-lg"
                      loading="lazy"
                      width={800}
                      height={800}
                    />
                    <div
                      className={`${
                        isDarkMode ? "text-[#F0F0F0]" : "text-[#353535]"
                      } flex-1`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span>{product.name}</span>
                          <span className="font-semibold">
                            {formatRupiah(product.harga * quantity)}
                          </span>
                        </div>
                        <div className="text-xxs pl-2">x{quantity}</div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-4 mb-0 xl:mb-4 relative">
                  <div
                    className={`${
                      isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                    } p-6 md:px-0 font-bold text-lg leading-9`}
                  >
                    Promo Tersedia untuk Produk ini
                  </div>

                  <PromoProduct />

                  <div className="p-6">
                    <Chatbot
                      productName={product.name}
                      productDescription={product.deskripsi}
                      productHarga={product.harga}
                    />
                  </div>
                </section>

                {/* Tombol untuk mobile */}
                <div className="mt-4 md:hidden">
                  <section
                    className={`${
                      isDarkMode
                        ? "bg-[#303030] text-[#f0f0f0]"
                        : "bg-[#ffffff] text-[#353535]"
                    } rounded-lg p-4 mb-3 xl:mb-4`}
                  >
                    <div className="p6">Informasi Produk</div>
                    <hr className="mt-4 border-t border-gray-300" />
                    <div className="flex items-center justify-between pt-4">
                      <div>BV</div>
                      <div>{product.bv} BV</div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div>Berat Pengiriman</div>
                      <div>{product.beratPengiriman} gr</div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div>Berat Bersih Satuan</div>
                      <div>{product.beratBersih} ml</div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div>Pemesanan minimal</div>
                      <div>{product.pemesananMin} pcs</div>
                    </div>
                  </section>

                  <section
                    className={`${
                      isDarkMode
                        ? "bg-[#303030] text-[#f0f0f0]"
                        : "bg-[#ffffff] text-[#353535]"
                    } rounded-lg p-6 mb-3 xl:mb-4`}
                  >
                    <h2 className="h3 pb-2">Jaminan Mutu</h2>
                    <div className="pt-4 flex items-center">
                      <i className="text-xl bx bx-check-circle text-[#28a154]"></i>
                      <div>100% Produk Original</div>
                      <button
                        type="button"
                        className="ml-auto text-xl text-primary"
                      >
                        <i className="text-xl bx bx-info-circle text-[#28a154]"></i>
                      </button>
                    </div>
                  </section>
                  <div
                    className={`${
                      isDarkMode ? "bg-[#303030]" : "bg-[#ffffff]"
                    } fixed gap-4 bottom-0 left-0 w-full p-4 shadow-2xl flex justify-between items-center z-50`}
                  >
                    <Btn
                      className="flex-1"
                      variant="outline"
                      onClick={handleAddToCart}
                    >
                      <i className="bx bx-cart-add text-lg"></i> Keranjang
                    </Btn>
                    <Btn className="flex-1" onClick={handleBuyNow}>
                      Beli Sekarang
                      <i className="bx bx-right-arrow-alt text-lg"></i>
                    </Btn>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
