import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router";

const Banner = () => {
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
          {/* Slide 1 */}
          <SwiperSlide>
            <Link to="/voucher">
              <img
                src="/assets/images/promo-25.png"
                alt="Promo 3"
                className="w-full h-auto rounded-lg"
              />
            </Link>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <img
              src="/assets/images/chatbot.png"
              alt="Promo 2"
              className="w-full h-auto rounded-lg"
            />
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <img
              src="/assets/images/katalog.png"
              alt="Promo 1"
              className="w-full h-auto rounded-lg"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
