import { useQuery, useMutation, useQueryClient } from "react-query";
import * as cartService from "../services/cartService";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

// Query keys
export const CART_QUERY_KEY = "cart";

// Hook để lấy dữ liệu giỏ hàng
export const useCart = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: [CART_QUERY_KEY],
    queryFn: async () => {
      console.log("useCart - Calling cartService.getCart()");
      const result = await cartService.getCart();
      console.log("useCart - API Response:", result);

      // Kiểm tra cấu trúc response và trả về dữ liệu đúng
      if (result && result.success && result.data) {
        console.log("useCart - Returning cart data:", {
          cartItems: result.data.cartItems,
          length: result.data.cartItems?.length,
        });
        return result.data; // Return the cart object from data field
      } else {
        console.log("useCart - Invalid response structure:", result);
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

  // Debug: Log dữ liệu cart
  console.log("useCartStats - cartData:", cartData);
  console.log("useCartStats - isLoading:", isLoading);
  console.log("useCartStats - error:", error);
  console.log("useCartStats - user:", user);

  // Nếu user chưa đăng nhập, trả về giá trị mặc định
  if (!user) {
    console.log("useCartStats - No user, returning empty cart");
    return {
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isEmpty: true,
    };
  }

  // Nếu đang loading hoặc có lỗi
  if (isLoading) {
    console.log("useCartStats - Loading, returning empty cart");
    return {
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isEmpty: true,
    };
  }

  if (error) {
    console.log("useCartStats - Error:", error);
    return {
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      isEmpty: true,
    };
  } // Truy cập đúng cấu trúc: cartData.cartItems
  // cartData bây giờ là cart object từ response.data
  const cartItems = cartData?.cartItems || [];
  console.log("useCartStats - cartItems after extraction:", cartItems);
  console.log("useCartStats - cartItems type:", Array.isArray(cartItems));
  console.log("useCartStats - cartItems length:", cartItems.length);

  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * (item.quantity || 0);
  }, 0);

  const isEmpty = cartItems.length === 0;

  console.log("useCartStats - Final stats:", {
    totalItems,
    totalPrice,
    isEmpty,
    cartItemsLength: cartItems.length,
  });

  return {
    cartItems,
    totalItems,
    totalPrice,
    isEmpty,
  };
};
