import BannerCard from "./BannerCard";

const BannerGridSection = () => {
  return (
    <section
      className="w-full sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[66%] mx-auto 
    my-8 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Left large banner */}
      <BannerCard
        image="/images/banner/ps5.png"
        title="PlayStation 5"
        description="Với phiên bản 2 màu mới nhất đang hot nhất hiện nay"
        large
      />

      {/* Right 3 stacked banners */}
      <div className="grid grid-cols-1  ">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <BannerCard
            image="/images/banner/women.png"
            title="Women’s Collections"
            description="Featured woman collections that give you another vibe."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <BannerCard
            image="/images/banner/speaker.png"
            title="Speakers"
            description="Amazon wireless speakers"
          />
          <BannerCard
            image="/images/banner/perfume.png"
            title="Perfume"
            description="GUCCI INTENSE OUD EDP"
          />
        </div>
      </div>
    </section>
  );
};

export default BannerGridSection;
