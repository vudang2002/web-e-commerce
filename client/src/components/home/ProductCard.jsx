import { Link } from "react-router-dom";

const ProductCard = ({ id, image, title, price, sold, discount, badge }) => {
  return (
    <Link
      to={id ? `/product/${id}` : "#"}
      className="text-inherit no-underline"
    >
      <div
        className="relative group hover:shadow-lg transition duration-300 hover:scale-105
          overflow-hidden cursor-pointer"
        style={{ minHeight: "270px" }}
      >
        <div
          className="group bg-white rounded hover:rounded-b-none shadow-sm border p-2 hover:shadow-md transition
       hover:border-red-500 relative flex flex-col justify-between"
          style={{ minHeight: "250px" }}
        >
          <div>
            <div className="relative">
              <img
                src={
                  image.length > 0 ? image[0] : "/images/products/manhinh.png"
                }
                alt={title}
                className="w-full h-40 object-cover rounded"
              />
              {discount && discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
              {badge && (
                <span className="absolute bottom-2 left-2 bg-orange-400 text-white text-xs px-1 py-0.5 rounded">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-medium line-clamp-2">{title}</p>
            <p className="text-red-500 font-bold mt-1 text-sm">
              ₫{price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Đã bán {sold}</p>
          </div>
        </div>
        <button
          className="group-hover:block hidden
         bg-orange-500 text-white text-sm 
          hover:bg-orange-600 w-full absolute bottom-0 left-0 rounded-b"
          onClick={(e) => {
            e.preventDefault();
            // Future implementation for finding similar products
          }}
        >
          Tìm sản phẩm tương tự
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
