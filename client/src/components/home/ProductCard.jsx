import { Link } from "react-router-dom";
import AddToCartButton from "../cart/AddToCartButton";
import ProductPrice from "../common/ProductPrice";

const ProductCard = ({
  product,
  id,
  image,
  title,
  price,
  sold,
  discount,
  badge,
}) => {
  // Support both direct props and product object
  const productData = product || {
    _id: id,
    images: image ? [image] : [],
    name: title,
    price: price,
    sold: sold,
    discount: discount,
    badge: badge,
  };
  const {
    _id: productId,
    images,
    name,
    sold: productSold,
    discount: productDiscount,
    badge: productBadge,
  } = productData;
  return (
    <div className="relative group hover:shadow-lg transition duration-300 hover:scale-105 overflow-hidden">
      <Link
        to={productId ? `/product/${productId}` : "#"}
        className="text-inherit no-underline block"
      >
        <div
          className="group bg-white  hover:rounded-b-none shadow-sm border 
           hover:shadow-md transition
       hover:border-red-500 relative flex flex-col justify-between"
          style={{ minHeight: "250px" }}
        >
          <div>
            <div className="relative">
              <img
                src={
                  images && images.length > 0
                    ? images[0]
                    : "/images/products/manhinh.png"
                }
                alt={name}
                className="w-full h-40 object-cover"
              />
              {productDiscount && productDiscount > 0 && (
                <span
                  className="absolute top-0 right-0 bg-primary text-white text-sm 
                px-1 py-0.5"
                >
                  -{productDiscount}%
                </span>
              )}
            </div>{" "}
            <p className="mt-2 text-sm line-clamp-2 m-2">
              {productBadge && (
                <span className="bg-primary text-white text-xs px-1 py-0.5 rounded mr-1">
                  {productBadge}
                </span>
              )}
              {name}
            </p>
            <ProductPrice
              product={productData}
              size="sm"
              className="mt-1 m-2"
              showDiscount={true}
            />
            <p className="text-xs text-gray-500 mt-1 m-2">
              Đã bán {productSold}
            </p>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - appears on hover */}
      <div
        className="group-hover:block hidden absolute bottom-0 left-0 w-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <AddToCartButton
          productId={productId}
          quantity={1}
          size="small"
          variant="red"
          className="w-full rounded-none rounded-b text-xs py-2"
          showIcon={false}
        >
          Thêm vào giỏ hàng
        </AddToCartButton>
      </div>
    </div>
  );
};

export default ProductCard;
