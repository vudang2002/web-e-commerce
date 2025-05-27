import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const banners = [
  {
    image: "/images/banner/banner1.jpg",
    alt: "Ngày hội siêu ưu đãi",
  },
  {
    image: "/images/banner/banner2.jpg",
    alt: "Giới thiệu ShopeePay",
  },
  {
    image: "/images/banner/banner3.jpg",
    alt: "Thanh toán ShopeePay",
  },
  {
    image: "/images/banner/banner2.jpg",
    alt: "Giới thiệu ShopeePay",
  },
  {
    image: "/images/banner/banner3.jpg",
    alt: "Thanh toán ShopeePay",
  },
];

const PromoCarousel = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      const swiper = document.querySelector(".swiper").swiper;
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  return (
    <div className="pt-2 relative sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[66%] mx-auto ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="rounded-lg overflow-hidden"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full  object-cover "
            />
          </SwiperSlide>
        ))}

        {/* Nút điều hướng trái */}
        <button
          ref={prevRef}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white hover:text-gray-700 p-2 z-10 hidden sm:block"
        >
          <AiOutlineLeft size={30} />
        </button>

        {/* Nút điều hướng phải */}
        <button
          ref={nextRef}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:text-gray-700 p-2 z-10 hidden sm:block"
        >
          <AiOutlineRight size={30} />
        </button>
      </Swiper>
    </div>
  );
};

export default PromoCarousel;
