import { useState, useEffect } from "react";
import { Link } from "react-router";
import usePopupVoucher from "../context/PopupVoucher";

type PopupVoucherProps = {
  onClose: () => void;
};

const PopupVoucher = ({ onClose }: PopupVoucherProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { popupVoucher, loading, error } = usePopupVoucher();

  useEffect(() => {
    const hasClosed = sessionStorage.getItem("popupVoucherClosed");
    if (hasClosed === "true") {
      setIsOpen(false);
      onClose();
    }
  }, [onClose]);

  const handleClose = () => {
    sessionStorage.setItem("popupVoucherClosed", "true");
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  if (loading)
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center h-full backdrop-blur-xs bg-[#00000070]">
        <div className="w-full max-w-md rounded-lg p-4 relative flex flex-row items-center justify-center gap-2">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          <p className="text-[#f0f0f0]">Memuat data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="py-4 w-full">
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            <i className="bx bx-x-circle mr-1"></i>
            {error}
          </p>
        </div>
      </div>
    );

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center h-full backdrop-blur-xs bg-[#000000b5]">
        <div className="w-full max-w-md rounded-lg p-4 relative">
          <button
            className="absolute top-2 right-2 cursor-pointer text-white p-1 rounded-full"
            onClick={handleClose}
          >
            <i className="bx bxs-x-circle text-5xl"></i>
          </button>
          <Link to="/voucher">
            <img
              src={`${import.meta.env.VITE_API_URL}/storage/${
                popupVoucher?.picture
              }`}
              alt="voucher"
              className="w-full h-auto"
              width={1570}
              height={2160}
            />
          </Link>
        </div>
      </div>
    )
  );
};

export default PopupVoucher;
