import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import FlashSaleProductCard from "./FlashSaleProductCard";
import Countdown from "react-countdown";
import { useFeaturedProducts } from "../../hooks/useProductData";

// Fallback data nếu API không có kết quả
const fallbackProducts = [
  {
    image: "/images/products/manhinh.png",
    price: 132800,
    badge: "ĐANG BÁN CHẠY",
    discount: "-24%",
  },
  {
    image: "/images/products/manhinh.png",
    price: 120000,
    badge: "ĐANG BÁN CHẠY",
    discount: "-53%",
  },
];

// Countdown renderer

const FlashSaleSection = () => {
  // Sử dụng React Query hook để lấy sản phẩm nổi bật
  const {
    data: featuredProducts = [],
    isLoading,
    error,
  } = useFeaturedProducts();

  console.log("featuredProducts trong FlashSaleSection:", featuredProducts);

  // Sử dụng fallbackProducts nếu không có dữ liệu hoặc có lỗi
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

  console.log("displayProducts được sử dụng:", displayProducts);

  // Nếu đang loading và không có sản phẩm
  if (isLoading && featuredProducts.length === 0) {
    return (
      <section className="w-full sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[66%] mx-auto py-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </section>
    );
  }

  // Nếu có lỗi và không có sản phẩm nào (sẽ sử dụng fallbackProducts)
  if (error && featuredProducts.length === 0) {
    console.error("Lỗi khi tải sản phẩm nổi bật:", error);
    // Tiếp tục với fallbackProducts
  }

  return (
    <section className="w-full sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[66%] mx-auto py-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-red-600 uppercase ml-4">
            Sản Phẩm Nổi Bật
          </h2>
        </div>
        <Link
          to="/featured-products"
          className="text-sm text-red-500 hover:underline"
        >
          Xem tất cả &gt;
        </Link>
      </div>{" "}
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        autoplay={{ delay: 5000 }}
        loop={displayProducts.length > 5}
      >
        {" "}
        {displayProducts.map((product, index) => (
          <SwiperSlide key={product._id || index}>
            <FlashSaleProductCard
              image={
                Array.isArray(product.images)
                  ? product.images[0]
                  : product.images || "/images/products/manhinh.png"
              }
              price={product.price}
              badge="NỔI BẬT"
              name={product.name}
              id={product._id}
              discount={product.discount ? `-${product.discount}%` : null}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FlashSaleSection;
