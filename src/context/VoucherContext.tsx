import { useEffect, useState } from "react";
import axios from "axios";
import { Voucher } from "../types/Voucher";

const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Voucher[]>("http://localhost:5000/api/vouchers")
      .then((response) => {
        setVouchers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vouchers:", error);
        setError("Gagal memuat voucher");
        setLoading(false);
      });
  }, []);

  return { vouchers, loading, error };
};

export default useVouchers;
