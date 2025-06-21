import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import useBanners from "../context/BannersContext";
import SkeletonBanner from "./SkeletonBanner";

const Banner = () => {
  const { banners, loading, error } = useBanners();

  if (loading) return <SkeletonBanner />;

  if (error)
    return (
      <div className="py-4 w-full">
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            <i className="bx bx-x-circle mr-1"></i>
            {error}
          </p>
        </div>
      </div>
    );

  return (
    <div className="w-full mb-8">
      <div className="mx-auto">
        {/* Swiper Container */}
        <Swiper
          spaceBetween={20}
          centeredSlides={true}
          autoplay={{
            delay: 3000, // Auto geser setiap 3 detik
            disableOnInteraction: false,
          }}
          loop={false} // Looping agar tak berhenti di slide terakhir
          modules={[Autoplay]}
        >
          {banners.map((banners, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${import.meta.env.VITE_API_URL}/storage/${
                  banners.picture
                }`}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                width={1560}
                height={531}
              />
            </SwiperSlide>
          ))}
          {/* Slide 1 */}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
