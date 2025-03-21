// components/CardProduct.tsx
import { useNavigate } from "react-router";
import { Product } from "../types/Product";
import Btn from "./Btn";

interface CardProductProps extends Product {
  isDarkMode: boolean;
}

const CardProduct = (props: CardProductProps) => {
  const navigate = useNavigate();

  // Destructuring props
  const {
    name = "Unknown",
    picture,
    harga,
    rate,
    terjual,
    beratPengiriman,
    beratBersih,
    pemesananMin,
    deskripsi,
    category_id,
    bv,
    id,
  } = props;

  const productSlug = name?.toLowerCase().replace(/\s+/g, "-");

  const handleClick = () => {
    navigate(`/product/${id}-${productSlug}`, {
      state: {
        id,
        name,
        harga,
        picture,
        rate,
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

  return (
    <div
      className={`${
        props.isDarkMode ? "bg-[#303030] text-white" : "bg-white text-[#303030]"
      } rounded-lg shadow-lg flex flex-col items-center text-center justify-between cursor-pointer`}
      onClick={handleClick} // Tambahkan onClick di sini
    >
      <img
        src={picture}
        alt={name}
        className="w-full object-cover rounded-t-lg"
      />

      <div className="p-4 w-full">
        <h3
          className={`${
            props.isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
          } text-lg text-left font-normal mt-2`}
        >
          {name}
        </h3>

        <div className="flex items-center flex-row w-full mt-2 text-sm">
          <div className="flex flex-col text-left gap-1">
            <div className="flex flex-row items-center">
              <span
                className={`${
                  props.isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                } text-base font-bold`}
              >
                Rp {harga.toLocaleString()}
              </span>
              <span className="text-[#353535] text-xs">&nbsp;/ pcs</span>
            </div>

            {terjual ? (
              <div className="flex flex-row items-center">
                <span className="text-[#959595] text-sm">
                  <i className="bx bxs-star text-sm text-[#FFD52DFF]"></i>{" "}
                  {rate}
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
                  {rate}
                </span>
                <span className="text-[#959595] text-lg px-1">|</span>
                <span className="text-[#959595] text-sm">Terjual -</span>
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
