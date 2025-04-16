import { useEffect, useState } from "react";
import axios from "axios";
import { PopupVoucher } from "../types/PopupVoucher";

const usePopupVoucher = () => {
  const [popupVoucher, setPopupVoucher] = useState<PopupVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopupVoucher = async () => {
      try {
        const response = await axios.get<PopupVoucher[]>(
          `${import.meta.env.VITE_APP_API_URL}/api/popup-voucher`
        );
        setPopupVoucher(response.data);
      } catch (error) {
        console.error("Error fetching popup voucher:", error);
        setError("Gagal memuat popup voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchPopupVoucher();
  }, []);

  return { popupVoucher, loading, error };
};

export default usePopupVoucher;
