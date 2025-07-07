import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  useProductDetail,
  useBrands,
  useCategories,
} from "../hooks/useProductData";
import { useAuth } from "../contexts/AuthContext";
import { useProductReviews } from "../hooks/useReview";
import AddToCartButton from "../components/cart/AddToCartButton";
import ProductPrice from "../components/common/ProductPrice";
import Breadcrumb from "../components/common/Breadcrumb";
import ProductReviews from "../components/product/ProductReviews";
import { useBreadcrumb } from "../hooks/useBreadcrumb";
import { ToastContainer, toast } from "react-toastify";
import {
  FiHeart,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading, error } = useProductDetail(id);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const { data: reviewsData } = useProductReviews(id);
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

  // Tính toán rating và số lượt reviews từ dữ liệu thực tế - theo cách của ProductReviews
  // Debug logging
  console.log("ProductDetail Reviews Debug:", {
    productId: id,
    reviewsData,
    reviewsKeys: reviewsData ? Object.keys(reviewsData) : [],
    reviewsDataData: reviewsData?.data,
    reviewsSuccess: reviewsData?.success,
    reviewsDataType: typeof reviewsData?.data,
    reviewsDataLength: reviewsData?.data?.length,
  });

  const reviewsArray = useMemo(() => {
    return Array.isArray(reviewsData?.data)
      ? reviewsData.data
      : Array.isArray(reviewsData?.success)
      ? reviewsData.success
      : Array.isArray(reviewsData)
      ? reviewsData
      : [];
  }, [reviewsData]);

  console.log("ProductDetail Reviews Array:", {
    reviewsArray,
    reviewsArrayLength: reviewsArray.length,
    firstReview: reviewsArray[0],
  });

  const totalReviews = reviewsArray.length;
  const averageRating = useMemo(() => {
    return totalReviews > 0
      ? (
          reviewsArray.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : 0;
  }, [reviewsArray, totalReviews]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[selectedImg]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {product.images &&
                  product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImg === idx
                          ? "border-red-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Title and Badge */}
              <div>
                <h1 className="text-2xl font-medium text-gray-900 mb-3">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-red-500 font-medium">
                      {averageRating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-blue-600 text-sm cursor-pointer hover:underline">
                    {totalReviews} Đánh Giá
                  </span>
                  <span className="text-gray-500 text-sm">
                    Đã Bán {product.sold || 24}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-red-600">
                    ₫{(product.price || 0).toLocaleString("vi-VN")}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          ₫{product.originalPrice.toLocaleString("vi-VN")}
                        </span>
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                          -
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          %
                        </span>
                      </>
                    )}
                </div>
              </div>

              {/* Policies */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FiShield className="w-4 h-4" />
                  <span>Trả hàng miễn phí 15 ngày</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="text-red-500">❤</span>
                  <span>Chính hãng 100%</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Miễn phí vận chuyển</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">
                  Số Lượng
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-300"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product?.stock || 0)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product?.stock || 0} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-52">
                <AddToCartButton
                  productId={id}
                  quantity={quantity}
                  size="large"
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                >
                  Thêm Vào Giỏ Hàng
                </AddToCartButton>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Mua Ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Chi tiết sản phẩm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Specifications */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">
                Thông số kỹ thuật
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-medium">
                    {categoryName || "Chưa phân loại"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Thương hiệu:</span>
                  <span className="font-medium">
                    {brandName || "Chưa xác định"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tình trạng:</span>
                  <span
                    className={`font-medium ${
                      (product?.stock || 0) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(product?.stock || 0) > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">
                Mô tả sản phẩm
              </h4>
              <div className="text-gray-700 leading-relaxed">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Chưa có mô tả chi tiết</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ProductReviews productId={id} limit={5} />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
