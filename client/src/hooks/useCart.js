import { useQuery, useMutation, useQueryClient } from "react-query";
import * as cartService from "../services/cartService";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { calculateDiscountedPrice } from "../utils/formatters";

// Query keys
export const CART_QUERY_KEY = "cart";

// Hook để lấy dữ liệu giỏ hàng
export const useCart = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: [CART_QUERY_KEY],
    queryFn: async () => {
      const result = await cartService.getCart();

      // Kiểm tra cấu trúc response và trả về dữ liệu đúng
      if (result && result.success && result.data) {
        return result.data; // Return the cart object from data field
      } else {
        return { cartItems: [], success: false };
      }
    },
    enabled: !!user, // Chỉ fetch khi user đã đăng nhập
    staleTime: 0, // Luôn fetch fresh data
    cacheTime: 0, // Không cache
    onError: (error) => {
      console.error("Error fetching cart:", error);
      if (error?.response?.status !== 401) {
        toast.error("Có lỗi khi tải giỏ hàng");
      }
    },
  });
};

// Hook để thêm sản phẩm vào giỏ hàng
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      cartService.addToCart(productId, quantity),
    onSuccess: () => {
      // Invalidate và refetch cart data
      queryClient.invalidateQueries([CART_QUERY_KEY]);
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast.error(
        error?.response?.data?.message || "Có lỗi khi thêm vào giỏ hàng"
      );
    },
  });
};

// Hook để cập nhật số lượng sản phẩm trong giỏ hàng
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      cartService.updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries([CART_QUERY_KEY]);
      toast.success("Đã cập nhật giỏ hàng");
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
      toast.error(
        error?.response?.data?.message || "Có lỗi khi cập nhật giỏ hàng"
      );
    },
  });
};

// Hook để xóa sản phẩm khỏi giỏ hàng
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => cartService.removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries([CART_QUERY_KEY]);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    },
    onError: (error) => {
      console.error("Error removing cart item:", error);
      toast.error(error?.response?.data?.message || "Có lỗi khi xóa sản phẩm");
    },
  });
};

// Hook để xóa toàn bộ giỏ hàng
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries([CART_QUERY_KEY]);
      toast.success("Đã xóa toàn bộ giỏ hàng");
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast.error(error?.response?.data?.message || "Có lỗi khi xóa giỏ hàng");
    },
  });
};

// Hook để tính toán tổng tiền và thống kê giỏ hàng
export const useCartStats = () => {
  const { user } = useAuth();
  const { data: cartData, isLoading, error } = useCart();

  // Nếu user chưa đăng nhập, trả về giá trị mặc định
  if (!user) {
    return {
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isEmpty: true,
    };
  }
  // Nếu đang loading hoặc có lỗi
  if (isLoading) {
    return {
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isEmpty: true,
    };
  }
  if (error) {
    return {
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isEmpty: true,
    };
  } // Truy cập đúng cấu trúc: cartData.cartItems
  // cartData bây giờ là cart object từ response.data
  const cartItems = cartData?.cartItems || [];

  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );
  const totalPrice = cartItems.reduce((total, item) => {
    const discountedPrice = calculateDiscountedPrice(
      item.product?.price || 0,
      item.product?.discount || 0
    );
    return total + discountedPrice * (item.quantity || 0);
  }, 0);
  const isEmpty = cartItems.length === 0;

  return {
    cartItems,
    totalItems,
    totalPrice,
    isEmpty,
  };
};
