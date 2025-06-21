import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useProductDetail,
  useBrands,
  useCategories,
} from "../hooks/useProductData";
import { useAuth } from "../contexts/AuthContext";
import AddToCartButton from "../components/cart/AddToCartButton";
import ProductPrice from "../components/common/ProductPrice";
import Breadcrumb from "../components/common/Breadcrumb";
import ProductReviews from "../components/product/ProductReviews";
import { useBreadcrumb } from "../hooks/useBreadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProductDetail(id);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const breadcrumbItems = useBreadcrumb();
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
    <div className="w-full bg-gray-100">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="py-8">
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
              <div className="text-gray-500 text-sm mb-1">
                Brand: {brandName}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                Category: {categoryName}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                Availability: {product.countInStock || product.stock || 0} in
                Stock
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
                    <span
                      key={i}
                      className="bg-gray-200 px-3 py-1 rounded text-sm"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}
              {product.attributes && (
                <div className="flex gap-2 mb-4">
                  {product.attributes.map((a, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1 rounded text-sm"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}{" "}
              <div className="mb-4">
                <ProductPrice
                  product={product}
                  size="lg"
                  showDiscount={true}
                  className="justify-start"
                />
              </div>
            </div>

            {/* Quantity and Cart Controls */}
            <div className="mt-4 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Số lượng:
                </span>
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
                </button>{" "}
              </div>
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />{" "}
        </div>

        {/* Product Description Section */}
        <div className="mt-8 w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Chi tiết sản phẩm
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Specifications */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                  Thông tin cơ bản
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Danh mục:
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {categoryName || "Chưa phân loại"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Thương hiệu:
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {brandName || "Chưa xác định"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Tình trạng kho:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        (product?.stock || product?.countInStock || 0) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(product?.stock || product?.countInStock || 0) > 0
                        ? `Còn ${
                            product?.stock || product?.countInStock || 0
                          } sản phẩm`
                        : "Hết hàng"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Đánh giá:
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < (product.rating || 0)
                                ? "text-yellow-400 text-sm"
                                : "text-gray-300 text-sm"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.rating || 0}/5)
                      </span>
                    </div>
                  </div>

                  {product.sku && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Mã sản phẩm:
                      </span>
                      <span className="text-sm text-gray-900 font-mono">
                        {product.sku}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                  Mô tả sản phẩm
                </h4>

                <div className="prose prose-sm max-w-none">
                  {product.description ? (
                    <div className="text-gray-700 leading-relaxed">
                      {product.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-3">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-center py-8">
                      Chưa có mô tả chi tiết cho sản phẩm này
                    </div>
                  )}
                </div>

                {/* Product Attributes */}
                {product.attributes && product.attributes.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">
                      Thuộc tính đặc biệt:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {product.attributes.map((attr, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Features/Highlights */}
                {product.features && product.features.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">
                      Điểm nổi bật:
                    </h5>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Product Information */}
            {(product.specifications ||
              product.warranty ||
              product.shipping) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {product.specifications && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 mb-3">
                        Thông số kỹ thuật
                      </h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span>{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {product.warranty && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 mb-3">
                        Bảo hành
                      </h5>
                      <p className="text-sm text-gray-600">
                        {product.warranty}
                      </p>
                    </div>
                  )}

                  {product.shipping && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 mb-3">
                        Vận chuyển
                      </h5>
                      <p className="text-sm text-gray-600">
                        {product.shipping}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Reviews Section */}
        <div className="mt-8 w-full max-w-7xl mx-auto">
          <ProductReviews productId={id} limit={5} />
        </div>
      </div>
    </div>
  );
}
