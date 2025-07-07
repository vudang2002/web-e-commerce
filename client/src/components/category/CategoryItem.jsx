import { useNavigate } from "react-router-dom";

const CategoryItem = ({ icon, label, link }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="cursor-pointer text-center  transition-transform 
      duration-200 "
    >
      <div
        className="w-20 h-20 overflow-hidden hover:scale-105
       flex items-center justify-center   mt-2"
      >
        <img src={icon} alt={label} className="w-16 h-16 object-contain " />
      </div>
      <p className="text-sm mt-2">{label}</p>
    </div>
  );
};

export default CategoryItem;
