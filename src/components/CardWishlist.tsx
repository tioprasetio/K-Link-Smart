import { useNavigate } from "react-router";
import Btn from "./Btn";
import { useDarkMode } from "../context/DarkMode";
import { formatRupiah } from "../utils/formatCurrency";

interface CardWishlistProps {
  product_id: number;
  name?: string;
  harga?: number;
  picture?: string;
  bv?: number;
  beratPengiriman?: number;
  terjual?: number;
  average_rating?: string;
  onRemove: () => void;
}

const CardWishlist = ({
  product_id,
  name = "Unknown",
  harga = 0,
  picture,
  bv,
  beratPengiriman,
  terjual = 0,
  average_rating,
  onRemove,
}: CardWishlistProps) => {
  console.log("CardWishlist props:", { product_id, name, terjual, average_rating, bv });
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const productSlug = name.toLowerCase().replace(/\s+/g, "-");

  const handleClick = () => {
    navigate(`/product/${product_id}-${productSlug}`, {
      state: {
        product_id,
        name,
        harga,
        picture,
        bv,
        beratPengiriman,
        terjual,
        average_rating,
        // data lain jika kamu punya (optional)
      },
    });
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#303030] text-white" : "bg-white text-[#303030]"
      } rounded-lg shadow-lg flex flex-col items-center text-center justify-between cursor-pointer relative`}
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
        onClick={onRemove}
        className="flex items-center justify-center cursor-pointer absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-2 transition"
        title="Hapus dari wishlist"
      >
        <i className="bx bx-x text-xl" />
      </button>

      <div className="p-4 w-full">
        <h3
          className={`${
            isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
          } text-lg text-left font-normal mt-2`}
        >
          {name}
        </h3>
        <div className="flex items-center flex-row w-full mt-2 text-sm">
          <div className="flex flex-col text-left gap-1">
            <div className="flex flex-row items-center">
              <span
                className={`${
                  isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-base font-bold`}
              >
                {formatRupiah(harga)}
              </span>
              <span className="text-[#353535] text-xs">&nbsp;/ pcs</span>
            </div>

            {terjual ? (
              <div className="flex flex-row items-center">
                <span className="text-[#959595] text-sm">
                  <i className="bx bxs-star text-sm text-[#FFD52DFF]"></i>{" "}
                  {average_rating}
                </span>
                <span className="text-[#959595] text-sm px-1">|</span>
                <span className="text-[#959595] text-sm">
                  Terjual {terjual}
                </span>
              </div>
            ) : (
              <div className="flex flex-row items-center">
                <span className="text-[#959595] text-sm">
                  <i className="bx bxs-star text-xl text-[#FFD52DFF]"></i>{" "}
                  {average_rating}
                </span>
                <span className="text-[#959595] text-lg px-1">|</span>
                <span className="text-[#959595] text-sm">Terjual -</span>
              </div>
            )}
          </div>
        </div>
        {/* Tombol menuju detail produk */}
        <Btn onClick={handleClick}>Lihat</Btn>
      </div>
    </div>
  );
};

export default CardWishlist;
