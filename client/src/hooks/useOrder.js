import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import orderService from "../services/orderService";

// Query keys
export const ORDER_QUERY_KEYS = {
  orders: ["orders"],
  userOrders: (page, limit) => ["orders", "user", page, limit],
  orderById: (id) => ["orders", id],
  orderStats: ["orders", "stats"],
};

// Get user orders
export const useUserOrders = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.userOrders(page, limit),
    queryFn: async () => {
      console.log("Fetching user orders with page:", page, "limit:", limit);
      const result = await orderService.getUserOrders(page, limit);
      console.log("User orders result:", result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Get order by ID
export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.orderById(orderId),
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      // Invalidate user orders to refresh the list
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.orders,
      });
      return data;
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to place order";
      toast.error(message);
      throw error;
    },
  });
};

// Cancel order mutation
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      // Invalidate user orders to refresh the list
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.orders,
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to cancel order";
      toast.error(message);
    },
  });
};

// Update order status mutation (for admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success("Order status updated successfully");
      // Invalidate orders to refresh
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.orders,
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update order status";
      toast.error(message);
    },
  });
};

// Get order statistics (for admin)
export const useOrderStats = () => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.orderStats,
    queryFn: orderService.getOrderStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};
