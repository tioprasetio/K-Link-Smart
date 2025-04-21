import { useNavigate } from "react-router";
import Btn from "./Btn";

interface CardWishlistProps {
  product_id: number;
  name?: string;
  harga?: number;
  picture?: string;
  beratPengiriman?: number;
  onRemove: () => void;
}

const CardWishlist = ({
  product_id,
  name = "Unknown",
  harga,
  picture,
  beratPengiriman,
  onRemove,
}: CardWishlistProps) => {
  const navigate = useNavigate();
  const productSlug = name.toLowerCase().replace(/\s+/g, "-");

  const handleClick = () => {
    navigate(`/product/${product_id}-${productSlug}`, {
      state: {
        product_id,
        name,
        harga,
        picture,
        beratPengiriman,
        // data lain jika kamu punya (optional)
      },
    });
  };

  return (
    <div className="border p-4 rounded shadow relative bg-white">
      <img
        src={`${import.meta.env.VITE_API_URL}/storage/${picture}`}
        alt={name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-gray-600">Rp {harga?.toLocaleString()}</p>
      <p className="text-sm text-gray-500">Berat: {beratPengiriman} gram</p>

      {/* Tombol menuju detail produk */}
      <Btn onClick={handleClick}>Lihat</Btn>

      <button
        onClick={onRemove}
        className="flex items-center justify-center cursor-pointer absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 transition"
        title="Hapus dari wishlist"
      >
        <i className="bx bx-x text-xl" />
      </button>
    </div>
  );
};

export default CardWishlist;