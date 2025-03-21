// hooks/useProducts.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/Product";

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Gagal memuat produk");
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
};

export default useProducts;
