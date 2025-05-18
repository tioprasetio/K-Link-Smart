import { useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import CardWishlist from "../components/CardWishlist";
import NavbarComponent from "../components/Navbar";
import { useDarkMode } from "../context/DarkMode";
import { useNavigate } from "react-router";

const WishlistPage = () => {
  const { wishlistItems, fetchWishlist, loading, removeFromWishlist } =
    useWishlist();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate(); // Untuk pindah ke halaman checkout

  useEffect(() => {
    fetchWishlist(); // Pastikan data terbaru di-load saat halaman ini dibuka
  }, []);

  const totalItems = wishlistItems.length;

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
            onClick={() => navigate(-1)} // Tambahkan fungsi kembali
          ></i>
          <h1 className="text-2xl font-bold">
            Favorite Saya {totalItems > 0 ? `(${totalItems})` : ""}
          </h1>
        </div>

        {loading ? (
          <p>Loading wishlist...</p>
        ) : wishlistItems.length === 0 ? (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-600 text-sm">
              <i className="bx bx-x-circle mr-1"></i>
              Wishlist kamu masih kosong
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishlistItems.map((item) => (
              <CardWishlist
                key={item.id}
                product_id={item.product_id}
                name={item.name}
                harga={item.harga}
                picture={item.picture}
                bv={item.bv}
                beratPengiriman={item.beratPengiriman}
                terjual={item.terjual}
                average_rating={item.average_rating}
                onRemove={() => removeFromWishlist(item.product_id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
