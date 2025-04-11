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
    <div className="mb-16">
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        loop={false}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 2.3, spaceBetween: 10 },
          640: { slidesPerView: 4.3, spaceBetween: 20 },
          1024: { slidesPerView: 5.3, spaceBetween: 30 },
        }}
        className="mySwiper"
      >
        {categories.map((categories, index) => (
          <SwiperSlide key={index}>
            <Link to={`/category/${encodeURIComponent(categories.name)}`}>
              <div
                className={`${
                  isDarkMode ? "bg-[#303030]" : "bg-white"
                } p-4 rounded-lg text-center flex flex-col items-center min-h-[200px] justify-center`}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/storage/${
                    categories.picture
                  }`}
                  className="w-24 h-24 object-cover"
                  loading="lazy"
                  width={512}
                  height={512}
                  alt={categories.name}
                />
                <h3
                  className={`${
                    isDarkMode ? "text-[#f0f0f0]" : "text-[#353535]"
                  } text-lg font-semibold mt-2`}
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
