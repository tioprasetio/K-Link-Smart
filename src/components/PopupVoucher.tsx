import { useState, useEffect } from "react";
import { Link } from "react-router";
import usePopupVoucher from "../context/PopupVoucher";
import { useDarkMode } from "../context/DarkMode";

type PopupVoucherProps = {
  onClose: () => void;
};

const PopupVoucher = ({ onClose }: PopupVoucherProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { popupVoucher, loading, error } = usePopupVoucher();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const hasClosed = sessionStorage.getItem("popupVoucherClosed");
    if (hasClosed === "true") {
      setIsOpen(false);
      onClose();
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("popupVoucherClosed", "true");
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className={`${isDarkMode ? "text-white" : "text-[#353535]"}`}>
          Memuat data...
        </p>
      </div>
    );

  if (error) return <p>{error}</p>;

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
