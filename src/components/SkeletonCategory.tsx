import { Swiper, SwiperSlide } from "swiper/react";
import { useDarkMode } from "../context/DarkMode";

const SkeletonCategory = () => {
  const { isDarkMode } = useDarkMode();

  const bgCard = isDarkMode ? "bg-[#303030]" : "bg-white";
  const bgPlaceholder = isDarkMode ? "bg-[#454545]" : "bg-gray-300";

  // Dummy array to render multiple placeholder slides
  const dummySlides = Array(6).fill(null);

  return (
    <div className="mb-8 animate-pulse">
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          320: { slidesPerView: 2.3, spaceBetween: 10 },
          640: { slidesPerView: 4.3, spaceBetween: 20 },
          1024: { slidesPerView: 5.3, spaceBetween: 30 },
        }}
      >
        {dummySlides.map((_, index) => (
          <SwiperSlide key={index} className="py-2">
            <div
              className={`${bgCard} p-3 rounded-xl flex flex-row items-center min-h-[85px] min-w-[75px] gap-2`}
            >
              <div className={`w-12 h-12 rounded-lg ${bgPlaceholder}`}></div>
              <div className={`h-4 w-16 rounded ${bgPlaceholder}`}></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SkeletonCategory;
