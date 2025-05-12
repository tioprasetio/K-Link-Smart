// ProductVariantContext.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductVariant } from "../types/ProductVariant";

const useProductVariants = (productId: number | null) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    axios
      .get<ProductVariant[]>(
        `${import.meta.env.VITE_APP_API_URL}/api/product/${productId}/variants`
      )
      .then((response) => {
        setVariants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Gagal memuat variant produk");
        setLoading(false);
      });
  }, [productId]); // <-- agar useEffect berjalan ulang saat productId berubah

  return { variants, loading, error };
};

export default useProductVariants;
