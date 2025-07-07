import BannerCard from "./BannerCard";

const BannerGridSection = () => {
  return (
    <section
      className="w-full sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[66%] mx-auto 
    my-8 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Left large banner */}
      <BannerCard
        image="/images/banner/banner4.png"
        title=""
        description=""
        large
      />

      {/* Right 3 stacked banners */}
      <div className="grid grid-cols-1  ">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <BannerCard
            image="/images/banner/banner5.jpg"
            title=""
            description=""
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <BannerCard
            image="/images/banner/banner6.jpg"
            title=""
            description=""
          />
          <BannerCard
            image="/images/banner/banner7.jpg"
            title=""
            description=""
          />
        </div>
      </div>
    </section>
  );
};

export default BannerGridSection;
