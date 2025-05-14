import * as orderService from "../services/order.service.js";
import { createResponse } from "../utils/response.util.js";
import Product from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Ánh xạ productId thành product
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

    // Tính toán itemsPrice
    let itemsPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }
      itemsPrice += product.price * item.quantity;
    }

    // Tính toán shippingPrice (giả sử cố định là 10)
    const shippingPrice = 10;

    // Tính toán totalPrice
    const totalPrice = itemsPrice + shippingPrice;

    // Tạo đơn hàng
    const order = await orderService.createOrder({
      user: req.user._id,
      orderItems,
      shippingInfo,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the order",
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
  const { id } = req.params;
  const { status } = req.body;
  const updatedOrder = await orderService.updateOrderStatus(id, status);
  res.json(createResponse(updatedOrder));
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  await orderService.deleteOrder(id);
  res.json({ success: true, message: "Order deleted successfully" });
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
