import { useEffect, useState } from "react";
import axios from "axios";
import { Categories } from "../types/Categories";

const useCategories = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Categories[]>(`${import.meta.env.VITE_APP_API_URL}/api/categories`)
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Gagal memuat categories");
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
};

export default useCategories;
