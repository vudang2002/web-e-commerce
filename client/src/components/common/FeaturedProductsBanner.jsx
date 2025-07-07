import React from "react";

const FeaturedProductsBanner = () => {
  return (
    <div className="relative w-full h-full mb-6 overflow-hidden ">
      {/* Banner Image */}
      <img
        src="/images/banner/banner-featured-product.jpg"
        alt="Flash Sale Banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default FeaturedProductsBanner;
