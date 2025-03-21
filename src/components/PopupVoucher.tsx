import { useState, useEffect } from "react";
import { Link } from "react-router";

const PopupVoucher = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center h-full backdrop-blur-xs bg-[#000000b5]">
        <div className="w-full max-w-md rounded-lg p-4 relative">
          <button
            className="absolute top-5 right-5 cursor-pointer text-white p-1 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <i className="bx bxs-x-circle text-4xl"></i>
          </button>
          <Link to="/voucher">
            <img src="/assets/images/popupVoucher.png" alt="voucher" />
          </Link>
        </div>
      </div>
    )
  );
};

export default PopupVoucher;
