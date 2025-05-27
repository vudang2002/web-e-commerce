import { useNavigate } from "react-router-dom";

const PromoFeatureItem = ({ icon, label, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:text-primary transition-transform duration-300 transform hover:scale-105 "
    >
      <img src={icon} alt={label} className="w-10 h-10 object-contain" />
      <p className="text-sm font-medium text-center">{label}</p>
    </div>
  );
};

export default PromoFeatureItem;
