import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Link } from "react-router";
import { useDarkMode } from "../context/DarkMode";
import useCategories from "../context/CategoriesContext";

const Category = () => {
  const { isDarkMode } = useDarkMode();
  const { categories, loading, error } = useCategories();

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
    <div className="mb-8">
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        loop={false}
        breakpoints={{
          320: { slidesPerView: 2.3, spaceBetween: 10 },
          640: { slidesPerView: 4.3, spaceBetween: 20 },
          1024: { slidesPerView: 5.3, spaceBetween: 30 },
        }}
        className="mySwiper"
      >
        {categories.map((categories, index) => (
          <SwiperSlide key={index} className="py-2">
            <Link to={`/category/${encodeURIComponent(categories.name)}`}>
              <div
                className={`${
                  isDarkMode ? "bg-[#303030]" : "bg-white"
                } hover:scale-105 hover:shadow-md transition-all cursor-pointer p-3 rounded-xl gap-2 flex flex-row items-center min-h-[85px] min-w-[75px]`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${
                    isDarkMode ? "bg-[#303030]" : "bg-white"
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/storage/${
                      categories.picture
                    }`}
                    className="w-9 h-9 object-cover"
                    loading="lazy"
                    width={512}
                    height={512}
                    alt={categories.name}
                  />
                </div>
                <h3
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } text-xs font-semibold`}
                >
                  {categories.name}
                </h3>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Category;
