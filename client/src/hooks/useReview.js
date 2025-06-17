import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import * as reviewService from "../services/reviewService";

// Query keys
export const REVIEW_QUERY_KEYS = {
  reviews: ["reviews"],
  productReviews: (productId) => ["reviews", "product", productId],
};

// Get reviews for a product
export const useProductReviews = (productId) => {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.productReviews(productId),
    queryFn: () => reviewService.getReviewsByProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create review mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data, variables) => {
      toast.success("Đánh giá đã được gửi thành công!");
      // Invalidate and refetch product reviews
      queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.productReviews(variables.product),
      });
      // Invalidate all reviews
      queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.reviews,
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá";
      toast.error(message);
    },
  });
};

// Create multiple reviews mutation (for order)
export const useCreateMultipleReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.createMultipleReviews,
    onSuccess: (data, variables) => {
      toast.success("Tất cả đánh giá đã được gửi thành công!");
      // Invalidate reviews for all products in the order
      variables.forEach((review) => {
        queryClient.invalidateQueries({
          queryKey: REVIEW_QUERY_KEYS.productReviews(review.product),
        });
      });
      // Invalidate all reviews
      queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.reviews,
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá";
      toast.error(message);
    },
  });
};

// Delete review mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      toast.success("Đánh giá đã được xóa!");
      // Invalidate all reviews
      queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.reviews,
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Có lỗi xảy ra khi xóa đánh giá";
      toast.error(message);
    },
  });
};
