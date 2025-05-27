import PromoFeatureItem from "./PromoFeatureItem";
const features = [
  {
    img: "/images/feature/promo1.png",
    label: "Hàng Giá Hời",
    link: "/hot-deals",
  },
  {
    img: "/images/feature/promo2.png",
    label: "Mã Giảm Giá",
    link: "/vouchers",
  },
  {
    img: "/images/feature/promo3.png",
    label: "Style Voucher",
    link: "/style",
  },
  {
    img: "/images/feature/promo4.png",
    label: "Style Voucher",
    link: "/style",
  },
  {
    img: "/images/feature/promo5.png",
    label: "Flash Sale",
    link: "/flash-sale",
  },
  {
    img: "/images/feature/promo6.png",
    label: "Hàng Quốc Tế",
    link: "/international",
  },
];

const PromoFeatureGrid = () => {
  return (
    <div
      className="bg-white pb-4 pt-4 mx-auto sm:w-[95%] md:w-[95%] 
      lg:w-[95%] xl:w-[66%]
    grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-4 text-center"
    >
      {features.map((item, index) => (
        <PromoFeatureItem
          key={index}
          icon={item.img}
          label={item.label}
          link={item.link}
        />
      ))}
    </div>
  );
};

export default PromoFeatureGrid;
