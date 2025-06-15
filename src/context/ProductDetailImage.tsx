// context/ProductImageContext.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/Product";

export interface ProductImage {
  id: number;
  product_id: number;
  picture: string;
  created_at?: string;
  updated_at?: string;
}

// Interface untuk gambar gabungan (dari product + product_detail_image)
export interface CombinedImage {
  id: string; // bisa "main" atau id dari product_detail_image
  picture: string;
  source: "main" | "detail"; // untuk membedakan sumber gambar
}

const useProductImages = (
  productId: number | null,
  mainProduct?: Product | null
) => {
  const [detailImages, setDetailImages] = useState<ProductImage[]>([]);
  const [loadingProductDetail, setLoadingProductDetail] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setDetailImages([]);
      setLoadingProductDetail(false);
      return;
    }

    setLoadingProductDetail(true);
    axios
      .get<ProductImage[]>(
        `${import.meta.env.VITE_APP_API_URL}/api/product/${productId}/images`
      )
      .then((response) => {
        setDetailImages(response.data);
        setLoadingProductDetail(false);
      })
      .catch((error) => {
        console.error("Error fetching product images:", error);
        setError("Gagal memuat gambar produk");
        setLoadingProductDetail(false);
      });
  }, [productId]);

  // Fungsi untuk menggabungkan gambar utama + detail images
  const getAllImages = (): CombinedImage[] => {
    const combinedImages: CombinedImage[] = [];

    // Tambahkan gambar utama dari product terlebih dahulu, klo ga mau bisa dihapus
    if (mainProduct?.picture) {
      combinedImages.push({
        id: "main",
        picture: mainProduct.picture,
        source: "main",
      });
    }
    // hapus sampe sini

    // Tambahkan gambar detail
    detailImages.forEach((image) => {
      combinedImages.push({
        id: image.id.toString(),
        picture: image.picture,
        source: "detail",
      });
    });

    return combinedImages;
  };

  return {
    detailImages,
    loadingProductDetail,
    error,
    getAllImages,
  };
};

export default useProductImages;
