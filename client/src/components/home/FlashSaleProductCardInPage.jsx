import { Link } from "react-router-dom";
import ProductPrice from "../common/ProductPrice";

const FlashSaleProductCard = ({ image, price, badge, discount, name, id }) => {
  // Create a product object for ProductPrice component
  const product = {
    _id: id,
    name,
    price,
    discount: discount ? parseInt(discount.replace(/[-%]/g, "")) : 0,
  };
  return (
    <Link to={`/product/${id}`} className="block">
      <div className="relative bg-white rounded shadow p-2 text-center hover:shadow-lg transition-shadow">
        {discount && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 rounded font-bold">
            {discount}
          </span>
        )}
        <img
          src={image}
          alt={name || "product"}
          className="w-full h-full object-contain mb-2"
        />{" "}
        <h3 className="text-sm line-clamp-2 h-10 mb-1 text-gray-800">{name}</h3>
        <ProductPrice product={product} size="xl" showDiscount={true} />
        <p className="text-xs bg-gradient-to-r from-orange-400 to-red-500 text-white py-1 rounded mt-1">
          {badge}
        </p>
      </div>
    </Link>
  );
};

export default FlashSaleProductCard;
