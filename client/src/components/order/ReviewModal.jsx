import React, { useState } from "react";
import { FiStar, FiX, FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  orderDetails,
  isSubmitting = false,
}) => {
  const [reviews, setReviews] = useState({});

  if (!isOpen) return null;

  const handleRatingChange = (productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating,
      },
    }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comment,
      },
    }));
  };

  const handleSubmit = () => {
    // Validate that all products have ratings
    const orderItems = orderDetails?.orderItems || [];
    const missingReviews = orderItems.filter(
      (item) =>
        !reviews[item.product._id]?.rating ||
        reviews[item.product._id].rating < 1
    );

    if (missingReviews.length > 0) {
      toast.warning("Vui lòng đánh giá tất cả sản phẩm");
      return;
    }

    // Convert reviews object to array format
    const reviewsArray = orderItems.map((item) => ({
      product: item.product._id,
      rating: reviews[item.product._id]?.rating || 5,
      comment: reviews[item.product._id]?.comment || "",
    }));

    onSubmit(reviewsArray);
  };

  const renderStars = (productId, currentRating = 0) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(productId, star)}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              star <= currentRating
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          >
            <FiStar
              size={20}
              fill={star <= currentRating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Đánh giá sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Đơn hàng #{orderDetails?._id?.slice(-8).toUpperCase()}
            </p>
          </div>{" "}
          <div className="space-y-6">
            {orderDetails?.orderItems?.map((item) => (
              <div key={item.product._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={item.product.images?.[0] || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Số lượng: {item.quantity}
                    </p>

                    {/* Rating */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đánh giá: <span className="text-red-500">*</span>
                      </label>
                      {renderStars(
                        item.product._id,
                        reviews[item.product._id]?.rating || 0
                      )}
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhận xét:
                      </label>
                      <textarea
                        value={reviews[item.product._id]?.comment || ""}
                        onChange={(e) =>
                          handleCommentChange(item.product._id, e.target.value)
                        }
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
