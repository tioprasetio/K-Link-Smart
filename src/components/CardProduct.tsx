// components/CardProduct.tsx
import { useNavigate } from "react-router";
import { Product } from "../types/Product";
import Btn from "./Btn";
import { formatRupiah } from "../utils/formatCurrency";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import Swal from "sweetalert2";

interface CardProductProps extends Product {
  isDarkMode: boolean;
}

const CardProduct = (props: CardProductProps) => {
  const { isLoggedIn } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const navigate = useNavigate();

  // Destructuring props
  const {
    name = "Unknown",
    picture,
    harga,
    average_rating,
    terjual,
    beratPengiriman,
    beratBersih,
    pemesananMin,
    deskripsi,
    category_id,
    bv,
    id,
  } = props;

  // Gunakan average_rating jika tersedia, jika tidak gunakan sebagai fallback
  const displayRating = average_rating || 0;

  const productSlug = name?.toLowerCase().replace(/\s+/g, "-");

  const handleClick = () => {
    navigate(`/product/${id}-${productSlug}`, {
      state: {
        id,
        name,
        harga,
        picture,
        terjual,
        beratPengiriman,
        beratBersih,
        pemesananMin,
        deskripsi,
        category_id,
        bv,
      },
    });
  };

  const handleToggleWishlist = async (productId: number) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Oops...",
        text: "Anda harus login terlebih dahulu!",
        icon: "error",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      setWishlistLoading(true);

      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
        Swal.fire({
          title: "Berhasil!",
          text: "Produk dihapus dari wishlist.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addToWishlist(productId);
        Swal.fire({
          title: "Berhasil!",
          text: "Produk ditambahkan ke wishlist.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);
      Swal.fire({
        title: "Oops...",
        text:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memproses wishlist.",
        icon: "error",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div
      className={`${
        props.isDarkMode ? "bg-[#303030] text-white" : "bg-white text-[#303030]"
      } hover:scale-105 transition-all rounded-lg shadow-lg flex flex-col items-center text-center justify-between cursor-pointer relative`}
    >
      <img
        src={`${import.meta.env.VITE_API_URL}/storage/${picture}`}
        alt={name}
        className="w-full object-cover rounded-t-lg"
        loading="lazy"
        width={800}
        height={800}
      />

      <div className="flex items-center justify-center cursor-pointer absolute top-0 left-0 bg-[#28A154] text-[#FFFFFF] rounded-tl-lg rounded-br-lg md:text-sm text-xs font-bold p-2 transition">
        BV {bv}
      </div>

      <button
        onClick={() => handleToggleWishlist(props.id)}
        disabled={wishlistLoading}
        className="absolute top-2 right-2 p-2 rounded-full transition-all duration-300 cursor-pointer z-10"
        aria-label={
          isInWishlist(props.id)
            ? "Hapus dari wishlist"
            : "Tambahkan ke wishlist"
        }
      >
        {wishlistLoading ? (
          <i className="bx bx-loader-alt animate-spin text-2xl text-gray-500"></i>
        ) : isInWishlist(props.id) ? (
          <i className="bx bxs-heart text-2xl text-red-500"></i>
        ) : (
          <i className="bx bx-heart text-2xl text-gray-500 hover:text-red-500"></i>
        )}
      </button>

      <div className="p-2 w-full">
        <h3
          className={`${
            props.isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
          } text-xs sm:text-sm md:text-lg text-left font-normal mt-2`}
        >
          {name}
        </h3>

        <div className="flex items-center flex-row w-full mt-2 text-sm">
          <div className="flex flex-col text-left gap-1">
            <div className="flex flex-row items-center">
              <span
                className={`${
                  props.isDarkMode ? "text-[#f0f0f0]" : "text-[#28A154]"
                } text-sm md:text-lg font-bold`}
              >
                {formatRupiah(harga)}
              </span>
              <span className="text-[#353535] text-xs">&nbsp;/ pcs</span>
            </div>

            {terjual ? (
              <div className="flex flex-row items-center text-xs sm:text-sm md:text-lg">
                <span className="text-[#959595]">
                  <i className="bx bxs-star text-[#FFD52DFF]"></i>{" "}
                  {displayRating}
                </span>
                <span className="text-[#959595] px-1">|</span>
                <span className="text-[#959595]">Terjual {terjual}</span>
              </div>
            ) : (
              <div className="flex flex-row items-center text-xs sm:text-sm md:text-lg">
                <span className="text-[#959595]">
                  <i className="bx bxs-star text-[#FFD52DFF]"></i>{" "}
                  {displayRating}
                </span>
                <span className="text-[#959595] px-1">|</span>
                <span className="text-[#959595]">Terjual 0</span>
              </div>
            )}
          </div>
        </div>
        <Btn onClick={handleClick}>Lihat</Btn>
      </div>
    </div>
  );
};

export default CardProduct;
