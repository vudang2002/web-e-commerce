import React, { useState, useMemo } from "react";
import { useProductReviews } from "../../hooks/useReview";
import { FiStar, FiUser, FiFilter } from "react-icons/fi";

const ProductReviews = ({ productId, limit = 5 }) => {
  const { data: reviews, isLoading, error } = useProductReviews(productId);
  const [selectedRating, setSelectedRating] = useState("all"); // Debug logging
  console.log("ProductReviews Debug:", {
    productId,
    reviews,
    isLoading,
    error,
    reviewsKeys: reviews ? Object.keys(reviews) : [],
    reviewsData: reviews?.data,
    reviewsSuccess: reviews?.success,
    reviewsDataType: typeof reviews?.data,
    reviewsDataLength: reviews?.data?.length,
    firstReview: reviews?.data?.[0],
    secondReview: reviews?.data?.[1],
  }); // Additional debug for reviews array processing
  const reviewsArray = useMemo(() => {
    return Array.isArray(reviews?.data)
      ? reviews.data
      : Array.isArray(reviews?.success)
      ? reviews.success
      : Array.isArray(reviews)
      ? reviews
      : [];
  }, [reviews]);

  console.log("Reviews Array Processing:", {
    reviewsArray,
    reviewsArrayLength: reviewsArray.length,
    isArrayFromData: Array.isArray(reviews?.data),
    isArrayFromSuccess: Array.isArray(reviews?.success),
    isArrayFromReviews: Array.isArray(reviews),
    firstArrayItem: reviewsArray[0],
  });

  // Calculate rating statistics
  const ratingStats = useMemo(() => {
    if (reviewsArray.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviewsArray.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
        totalRating += review.rating;
      }
    });

    return {
      averageRating: totalRating / reviewsArray.length,
      totalReviews: reviewsArray.length,
      ratingDistribution: distribution,
    };
  }, [reviewsArray]);

  // Filter reviews based on selected rating
  const filteredReviews = useMemo(() => {
    if (selectedRating === "all") {
      return reviewsArray;
    }
    return reviewsArray.filter(
      (review) => Math.round(review.rating) === parseInt(selectedRating)
    );
  }, [reviewsArray, selectedRating]);

  const recentReviews = filteredReviews.slice(0, limit);

  console.log("Final Debug:", {
    recentReviews,
    recentReviewsLength: recentReviews.length,
    limit,
    shouldShowReviews: recentReviews.length > 0,
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Đánh giá sản phẩm
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gray-200 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Đánh giá sản phẩm
        </h3>
        <div className="text-center text-gray-500 py-8">
          Không thể tải đánh giá. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Đánh giá sản phẩm
        </h3>
        {ratingStats.totalReviews > limit && (
          <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
            Xem tất cả ({ratingStats.totalReviews} đánh giá)
          </button>
        )}
      </div>
      {/* Rating Overview */}
      {ratingStats.totalReviews > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {ratingStats.averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center mt-1">
                  {renderStars(Math.round(ratingStats.averageRating))}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {ratingStats.totalReviews} đánh giá
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 max-w-sm ml-6">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingStats.ratingDistribution[rating];
                const percentage =
                  ratingStats.totalReviews > 0
                    ? (count / ratingStats.totalReviews) * 100
                    : 0;

                return (
                  <div
                    key={rating}
                    className="flex items-center space-x-2 mb-1"
                  >
                    <span className="text-sm font-medium text-gray-700 w-3">
                      {rating}
                    </span>
                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
            <FiFilter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 mr-2">
              Lọc theo:
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedRating("all")}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedRating === "all"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả ({ratingStats.totalReviews})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingStats.ratingDistribution[rating];
                if (count === 0) return null;

                return (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating.toString())}
                    className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-1 ${
                      selectedRating === rating.toString()
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{rating}</span>
                    <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {recentReviews.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium mb-2">
            {selectedRating === "all"
              ? "Chưa có đánh giá nào"
              : `Chưa có đánh giá ${selectedRating} sao`}
          </p>
          <p className="text-sm">
            {selectedRating === "all"
              ? "Hãy là người đầu tiên đánh giá sản phẩm này!"
              : "Thử chọn mức đánh giá khác để xem đánh giá"}
          </p>
          {selectedRating !== "all" && (
            <button
              onClick={() => setSelectedRating("all")}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Xem tất cả đánh giá
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {recentReviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {review.user?.name || "Người dùng ẩn danh"}
                      </h4>
                      <div className="flex items-center mt-1">
                        <div className="flex space-x-1 mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <time className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </time>
                  </div>

                  {/* Review Comment */}
                  {review.comment && (
                    <div className="mt-3">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )}

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 flex space-x-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            // TODO: Implement image preview modal
                            console.log("Open image preview", image);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}{" "}
      {/* Show more button if there are more reviews */}
      {filteredReviews.length > limit && (
        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Xem thêm đánh giá
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
