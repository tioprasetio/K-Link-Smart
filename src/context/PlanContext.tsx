import { useEffect, useState } from "react";
import axios from "axios";
import { Plans } from "../types/Plan";

const usePlans = () => {
  const [plans, setPlans] = useState<Plans[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Plans[]>(`${import.meta.env.VITE_APP_API_URL}/api/plans`)
      .then((response) => {
        setPlans(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
        setError("Gagal memuat plans");
        setLoading(false);
      });
  }, []);

  return { plans, loading, error };
};

export default usePlans;
