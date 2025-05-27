import CategoryGrid from "../components/category/CategoryGrid";
import BannerGridSection from "../components/home/BannerGridSectio";
import FlashSaleSection from "../components/home/FlashSaleSection";
import ProductGridSection from "../components/home/ProductGridSection";
import PromoCarousel from "../components/home/PromoCarousel";
import PromoFeatureGrid from "../components/home/PromoFeatureGrid";

const HomePage = () => {
  return (
    <>
      <section className="w-full bg-white shadow-md rounded-lg ">
        <PromoCarousel />
        <PromoFeatureGrid />
      </section>

      <CategoryGrid />
      <FlashSaleSection />
      <BannerGridSection />
      <ProductGridSection />
    </>
  );
};

export default HomePage;
