import { useEffect, useState } from "react";
import axios from "axios";
import { Banners } from "../types/Banners";

const useBanners = () => {
  const [banners, setBanners] = useState<Banners[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Banners[]>(`${import.meta.env.VITE_APP_API_URL}/api/banners`)
      .then((response) => {
        setBanners(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
        setError("Gagal memuat banners");
        setLoading(false);
      });
  }, []);

  return { banners, loading, error };
};

export default useBanners;
