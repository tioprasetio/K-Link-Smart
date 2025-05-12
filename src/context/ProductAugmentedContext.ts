// ProductVariantContext.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductAugmented } from "../types/ProductAugmented";

const useProductAugmented = (productId: number | null) => {
  const [augmenteds, setAugmenteds] = useState<ProductAugmented[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    axios
      .get<ProductAugmented[]>(
        `${import.meta.env.VITE_APP_API_URL}/api/product/${productId}/augmented`
      )
      .then((response) => {
        setAugmenteds(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Gagal memuat variant produk");
        setLoading(false);
      });
  }, [productId]); // <-- agar useEffect berjalan ulang saat productId berubah

  return { augmenteds, loading, error };
};

export default useProductAugmented;
