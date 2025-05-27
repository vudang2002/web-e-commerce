const BannerCard = ({
  image,
  title,
  description,
  cta = "Shop Now",
  large = false,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${
        large ? "h-[300px] md:h-[500px]" : "h-[150px] md:h-[240px]"
      }`}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 p-4 text-white flex flex-col justify-end h-full">
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        {description && (
          <p className="text-sm md:text-base mt-1">{description}</p>
        )}
        <a
          href="#"
          className="mt-2 text-sm underline hover:text-gray-300 transition"
        >
          {cta}
        </a>
      </div>
    </div>
  );
};

export default BannerCard;
