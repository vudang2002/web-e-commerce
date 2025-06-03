import * as orderService from "../services/order.service.js";
import { createResponse } from "../utils/response.util.js";
import Product from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, voucherCode } = req.body;

    // Ánh xạ productId thành product (validation đã được thực hiện ở middleware)
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        return {
          product: product._id,
          quantity: item.quantity,
        };
      })
    );

    // Kiểm tra và thêm phoneNo vào shippingInfo
    if (!req.body.phoneNo) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required in shippingInfo",
      });
    }

    const shippingInfo = {
      address: shippingAddress,
      phoneNo: req.body.phoneNo,
    };

    // Tính toán shippingPrice (giả sử cố định là 10)
    const shippingPrice = 10;

    // Tạo order data base
    let orderData = {
      user: req.user._id,
      orderItems,
      shippingInfo,
      paymentMethod,
      shippingPrice,
      voucherCode: voucherCode || null,
    };

    // Áp dụng voucher và tính toán giá cuối cùng
    orderData = await orderService.applyVoucherToOrder(orderData);

    // Cập nhật stock và sold với transaction (xử lý race condition)
    await orderService.updateProductStockOnOrderCreate(orderItems);

    // Tạo đơn hàng
    const order = await orderService.createOrder(orderData);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    // Xử lý các loại lỗi khác nhau
    if (error.message.includes("Insufficient stock")) {
      return res.status(400).json({
        success: false,
        message: error.message,
        type: "INSUFFICIENT_STOCK",
      });
    }

    if (error.message.includes("inactive")) {
      return res.status(400).json({
        success: false,
        message: error.message,
        type: "PRODUCT_INACTIVE",
      });
    }

    if (error.message.includes("Voucher")) {
      return res.status(400).json({
        success: false,
        message: error.message,
        type: "VOUCHER_ERROR",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the order",
    });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);
  res.json(createResponse(order));
};

export const getUserOrders = async (req, res) => {
  const orders = await orderService.getOrdersByUser(req.user._id);
  res.json(createResponse(orders));
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Lấy thông tin đơn hàng hiện tại
    const currentOrder = await orderService.getOrderById(id);
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Nếu đơn hàng được hủy, hoàn lại stock và sold
    if (status === "Cancelled" && currentOrder.orderStatus !== "Cancelled") {
      await orderService.revertProductStockOnOrderCancel(
        currentOrder.orderItems
      );
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await orderService.updateOrderStatus(id, status);

    res.json(createResponse(updatedOrder, "Order status updated successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating order status",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin đơn hàng trước khi xóa
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Hoàn lại stock và sold nếu đơn hàng chưa bị hủy
    if (order.orderStatus !== "Cancelled") {
      await orderService.revertProductStockOnOrderCancel(order.orderItems);
    }

    // Xóa đơn hàng
    await orderService.deleteOrder(id);

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the order",
    });
  }
};

export const getAllOrders = async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.json(createResponse(orders));
};

export const markAsPaid = async (req, res) => {
  const { id } = req.params;
  const updatedOrder = await orderService.markAsPaid(id);
  res.json(createResponse(updatedOrder));
};

export const refundOrder = async (req, res) => {
  const { id } = req.params;
  const updatedOrder = await orderService.refundOrder(id);
  res.json(createResponse(updatedOrder));
};
