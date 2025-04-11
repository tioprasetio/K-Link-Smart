import { useEffect, useState } from "react";
import axios from "axios";
import { Voucher } from "../types/Voucher";

const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get<Voucher[]>(
          "http://localhost:5000/api/vouchers"
        );
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setError("Gagal memuat voucher");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  return { vouchers, loading, error };
};

export default useVouchers;
