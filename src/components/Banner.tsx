import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import useBanners from "../context/BannersContext";
import { useDarkMode } from "../context/DarkMode";

const Banner = () => {
  const { banners, loading, error } = useBanners();
  const { isDarkMode } = useDarkMode();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className={`${isDarkMode ? "text-white" : "text-[#353535]"}`}>
          Memuat data...
        </p>
      </div>
    );

  if (error) return <p>{error}</p>;

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
