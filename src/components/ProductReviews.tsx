import { useEffect, useState } from "react";
import { useReview } from "../context/ReviewContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

const ProductReviews = ({ productId }: { productId: number }) => {
  const { reviews, averageRating, totalReview, fetchReviews } = useReview();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        await fetchReviews(productId);
      } catch (err) {
        console.error("Gagal mengambil review:", err);
        setError("Gagal memuat review. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId, fetchReviews]);

  // Fungsi untuk menampilkan bintang dengan setengah bintang
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      // Bintang penuh
      if (i < Math.floor(rating)) {
        return (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
      // Setengah bintang
      else if (i < rating) {
        return (
          <div key={i} className="relative w-5 h-5">
            {/* Bintang abu-abu di belakang */}
            <svg
              className="w-5 h-5 text-gray-300 absolute"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Setengah bintang kuning di depan dengan clip-path */}
            <div className="absolute w-2.5 h-5 overflow-hidden">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      }
      // Bintang kosong
      else {
        return (
          <svg
            key={i}
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    });
  };

  // Fungsi untuk menampilkan bintang di dalam review (bintang penuh saja)
  const renderReviewStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return <div className="text-center py-4">Memuat review...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Belum ada review untuk produk ini.
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold">Review Produk</h2>
        <div className="ml-4 flex items-center">
          <div className="flex items-center">{renderStars(averageRating)}</div>
          <span className="ml-2 text-gray-600">
            {averageRating} dari {totalReview} review
          </span>
        </div>
      </div>

      <Swiper
        pagination={{ clickable: true }}
        loop={false}
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          320: { slidesPerView: 1.1, spaceBetween: 10 },
        }}
        className="promoSwiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="bg-white p-3 rounded-lg flex gap-4 h-32">
              <div className="flex-shrink-0 flex justify-center items-start pt-1">
                {review.user_picture ? (
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL}/uploads/profile/${
                      review.user_picture
                    }`}
                    alt="Current Profile"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center">
                    <span className="font-bold text-gray-700">
                      {review.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-md text-gray-800">
                  {review.user_name}
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex">{renderReviewStars(review.rating)}</div>
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-4 overflow-y-auto max-h-12">
                  {review.comment ? (
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      Tidak ada komentar
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductReviews;
