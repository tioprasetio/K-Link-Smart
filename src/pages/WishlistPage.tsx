import { useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import CardWishlist from "../components/CardWishList";

const WishlistPage = () => {
  const { wishlistItems, fetchWishlist, loading, removeFromWishlist } =
    useWishlist();

  useEffect(() => {
    fetchWishlist(); // Pastikan data terbaru di-load saat halaman ini dibuka
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Wishlist Saya</h1>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : wishlistItems.length === 0 ? (
        <p>Wishlist kamu masih kosong.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <CardWishlist
              key={item.id}
              product_id={item.product_id}
              name={item.name}
              harga={item.harga}
              picture={item.picture}
              beratPengiriman={item.beratPengiriman}
              onRemove={() => removeFromWishlist(item.product_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
