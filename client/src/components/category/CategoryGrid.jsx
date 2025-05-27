import { useState } from "react";
import CategoryItem from "./CategoryItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategories } from "../../hooks/useProductData";

// Add component style for category carousel
import { createGlobalStyle } from "styled-components";

const CategoryCarouselStyles = createGlobalStyle`  .category-swiper {
    padding: 0 40px;
  }
  .category-swiper .swiper-slide {
    height: auto;
    display: flex;
    justify-content: center;
  }  /* Remove category row styling as we're using a single row */
  .category-nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.8);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .category-nav-button:hover {
    background: white;
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
  }
`;

const CategoryGrid = () => {
  const [swiperRef, setSwiperRef] = useState(null);

  // Sử dụng hook useCategories từ useProductData.js
  const { data: categoriesData = [], isLoading, error } = useCategories();

  // Chuyển đổi dữ liệu danh mục cho phù hợp với CategoryItem props
  const categories = categoriesData.map((category) => ({
    icon: category.image, // sử dụng image từ API
    label: category.name, // sử dụng name từ API
    link: `/category/${category.slug}`, // sử dụng slug từ API
  }));
  return (
    <section className="w-full sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[66%] mx-auto pt-4 pb-4 relative">
      <CategoryCarouselStyles />
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4 uppercase text-red-600">
          Danh Mục
        </h2>{" "}
        {isLoading && (
          <div className="text-center py-4">Loading categories...</div>
        )}{" "}
        {error && (
          <div className="text-center text-red-500 py-4">
            {error.message || "Lỗi khi tải danh mục"}
          </div>
        )}
        {!isLoading && !error && (
          <div className="relative">
            {/* Prev Button */}
            <div
              className="category-nav-button left-0"
              onClick={() => swiperRef?.slidePrev()}
            >
              <FaChevronLeft className="text-gray-600" />
            </div>

            <Swiper
              onSwiper={setSwiperRef}
              modules={[Navigation]}
              spaceBetween={10}
              slidesPerView={20}
              slidesPerGroup={5}
              navigation={{
                prevEl: ".category-nav-button.left-0",
                nextEl: ".category-nav-button.right-0",
              }}
              breakpoints={{
                320: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 8 },
                480: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 8 },
                640: { slidesPerView: 6, slidesPerGroup: 6, spaceBetween: 8 },
                768: { slidesPerView: 7, slidesPerGroup: 7, spaceBetween: 8 },
                1024: {
                  slidesPerView: 10,
                  slidesPerGroup: 8,
                  spaceBetween: 8,
                },
                1280: { slidesPerView: 10, slidesPerGroup: 4, spaceBetween: 8 },
                1536: { slidesPerView: 12, slidesPerGroup: 4, spaceBetween: 8 },
              }}
              className="category-swiper"
            >
              {categories.map((item, index) => (
                <SwiperSlide key={index}>
                  <CategoryItem
                    icon={item.icon}
                    label={item.label}
                    link={item.link}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Next Button */}
            <div
              className="category-nav-button right-0"
              onClick={() => swiperRef?.slideNext()}
            >
              <FaChevronRight className="text-gray-600" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
