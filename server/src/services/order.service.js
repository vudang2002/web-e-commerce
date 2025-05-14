import Order from "../models/order.model.js";

export const createOrder = async (orderData) => {
  console.log("[createOrder] Order data:", orderData); // Log dữ liệu orderData
  return await Order.create(orderData);
};

export const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate("orderItems.product")
    .populate("user");
};

export const getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId }).populate("orderItems.product");
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.orderStatus = status;
  if (status === "Delivered") {
    order.deliveredAt = new Date();
  }

  return await order.save();
};

export const deleteOrder = async (orderId) => {
  return await Order.findByIdAndDelete(orderId);
};

export const getAllOrders = async () => {
  return await Order.find().populate("orderItems.product").populate("user");
};

export const markAsPaid = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.isPaid = true;
  return await order.save();
};

export const refundOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.isRefunded = true;
  return await order.save();
};
