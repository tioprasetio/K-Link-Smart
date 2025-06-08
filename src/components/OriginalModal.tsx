import { useEffect, useState } from "react";
import { useDarkMode } from "../context/DarkMode";
import { Product } from "../types/Product";

type OriginalModal = {
  show: boolean;
  onClose: () => void;
  product: Product | null; // boleh null agar fleksibel
};

const OriginalModal: React.FC<OriginalModal> = ({ show, onClose, product }) => {
  const { isDarkMode } = useDarkMode();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      // Delay unmounting for smooth close
      setTimeout(() => setVisible(false), 200);
    }
  }, [show]);

  if (!show && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-99 flex items-center justify-center bg-[#000000b5] backdrop-blur-sm p-4 w-full transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded-lg max-w-3xl w-full overflow-y-auto max-h-[90vh] transform transition-transform duration-300 ${
          show ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <img
            src="/assets/images/authenticity.png"
            className="h-64 w-auto"
            alt="K-Link"
            loading="lazy"
          />
        </div>
        <h1
          className={`${
            isDarkMode ? "text-[#353535]" : "text-[#353535]"
          } text-2xl mb-4 text-center`}
        >
          {product?.name} - <b>100% Produk Original</b>
        </h1>
        <p
          className={`${
            isDarkMode ? "text-[#353535]" : "text-[#353535]"
          } text-center`}
        >
          K-MART Online Store berkomitmen dalam memenuhi kebutuhan anda dengan
          jaminan produk 100% original
        </p>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-center font-semibold w-full border border-green-500 text-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OriginalModal;
