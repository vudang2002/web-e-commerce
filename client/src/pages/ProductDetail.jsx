import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useProductDetail,
  useBrands,
  useCategories,
} from "../hooks/useProductData";
import { useAuth } from "../contexts/AuthContext";
import AddToCartButton from "../components/cart/AddToCartButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProductDetail(id);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Lấy tên brand và category từ id
  const brandName =
    brands?.find((b) => b._id === (product?.brand?._id || product?.brand))
      ?.name || "";
  const categoryName =
    categories?.find(
      (c) => c._id === (product?.category?._id || product?.category)
    )?.name || "";

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }

    if (!product || product.stock < quantity) {
      toast.error("Sản phẩm không đủ số lượng");
      return;
    }

    // Create a temporary checkout data in sessionStorage
    const buyNowData = {
      items: [
        {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
          },
          quantity: quantity,
        },
      ],
      totalPrice: product.price * quantity,
      isBuyNow: true,
    };

    sessionStorage.setItem("buyNowData", JSON.stringify(buyNowData));
    navigate("/checkout");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Lỗi khi tải sản phẩm.</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div
      className="flex flex-col md:flex-row bg-white rounded-lg shadow px-4 py-2 
    mt-2 w-full max-w-7xl mx-auto"
    >
      {/* Hình ảnh sản phẩm */}
      <div className="flex flex-col items-center w-full max-w-[500px] mx-auto md:mx-0">
        {/* Ảnh lớn */}
        {product.images && product.images.length > 0 && (
          <img
            src={product.images[selectedImg]}
            alt={product.name}
            className="w-full h-[500px] object-contain rounded shadow my-4 bg-white mx-auto"
          />
        )}
        {/* Dãy ảnh nhỏ */}
        <div className="flex flex-row gap-[6px] justify-center mt-2">
          {product.images &&
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className={`md:w-24 md:h-24 object-cover rounded border-2 cursor-pointer transition-all duration-200 ${
                  selectedImg === idx ? "border-red-500" : "border-gray-200"
                }`}
                onClick={() => setSelectedImg(idx)}
              />
            ))}
        </div>
      </div>
      {/* Thông tin sản phẩm */}
      <div className="md:w-1/2 pl-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2 mt-2">{product.name}</h1>
          <div className="text-gray-500 text-sm mb-1">Brand: {brandName}</div>
          <div className="text-gray-500 text-sm mb-1">
            Category: {categoryName}
          </div>
          <div className="text-gray-500 text-sm mb-1">
            Availability: {product.countInStock || product.stock || 0} in Stock
          </div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < (product.rating || 0)
                    ? "text-red-500 text-xl"
                    : "text-gray-300 text-xl"
                }
              >
                ★
              </span>
            ))}
          </div>
          {/* Voucher và thuộc tính nếu có */}
          {product.vouchers && (
            <div className="flex gap-2 mb-2">
              {product.vouchers.map((v, i) => (
                <span key={i} className="bg-gray-200 px-3 py-1 rounded text-sm">
                  {v}
                </span>
              ))}
            </div>
          )}
          {product.attributes && (
            <div className="flex gap-2 mb-4">
              {product.attributes.map((a, i) => (
                <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">
                  {a}
                </span>
              ))}
            </div>
          )}{" "}
          <div className="flex items-end gap-4 mb-4">
            <span className="text-2xl font-bold text-red-600">
              {product.price?.toLocaleString("vi-VN")}đ
            </span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">
                {product.oldPrice?.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>
        </div>

        {/* Quantity and Cart Controls */}
        <div className="mt-4 space-y-4">
          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Số lượng:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="px-4 py-2 text-center min-w-[60px] border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (product?.stock || 0)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              ({product?.stock || 0} có sẵn)
            </span>
          </div>{" "}
          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex items-center gap-3">
            <AddToCartButton
              productId={id}
              quantity={quantity}
              size="large"
              variant="outline"
              className="flex-1 justify-center"
            >
              Thêm vào giỏ hàng
            </AddToCartButton>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
