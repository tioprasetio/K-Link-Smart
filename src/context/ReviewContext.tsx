import { createContext, useContext, useState } from "react";
import axios from "axios";

type Review = {
  id: number;
  user_id: number;
  product_id: number;
  order_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string; // ini dari api name di table users jadi -> user_name
  user_picture: string; // ini dari api name di table users jadi -> user_name
};

type ReviewContextType = {
  reviews: Review[];
  averageRating: number;
  totalReview: number;
  fetchReviews: (productId: number) => void;
  addReview: (data: {
    user_id: number;
    product_id: number;
    order_id: string;
    rating: number;
    comment?: string;
  }) => Promise<{ success: boolean; message: string }>;
};

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReview, setTotalReview] = useState<number>(0);

  const fetchReviews = async (productId: number) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/reviews`,
        {
          params: { product_id: productId },
        }
      );

      if (res.data.success) {
        // Pastikan data benar-benar berubah sebelum update state
        setReviews((prev) =>
          JSON.stringify(prev) !== JSON.stringify(res.data.data)
            ? res.data.data
            : prev
        );
        setAverageRating((prev) =>
          prev !== parseFloat(res.data.average_rating)
            ? parseFloat(res.data.average_rating)
            : prev
        );
        setTotalReview((prev) =>
          prev !== res.data.total_review ? res.data.total_review : prev
        );
      }
    } catch (err) {
      console.error("Gagal mengambil review:", err);
    }
  };

  const addReview = async ({
    user_id,
    product_id,
    order_id,
    rating,
    comment,
  }: {
    user_id: number;
    product_id: number;
    order_id: string;
    rating: number;
    comment?: string;
  }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/reviews`,
        {
          user_id,
          product_id,
          order_id,
          rating,
          comment,
        }
      );

      return {
        success: true,
        message: res.data.message,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Gagal tambah review:", err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan review",
      };
    }
  };

  return (
    <ReviewContext.Provider
      value={{ reviews, averageRating, totalReview, fetchReviews, addReview }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview harus digunakan di dalam ReviewProvider");
  }
  return context;
};
