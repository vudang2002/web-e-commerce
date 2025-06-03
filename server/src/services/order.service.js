import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import * as voucherService from "./voucher.service.js";
import mongoose from "mongoose";

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

// Tính toán giá cuối cùng của sản phẩm có discount
export const calculateFinalPrice = (price, discount = 0) => {
  return price * (1 - discount / 100);
};

// Tính toán tổng giá trị đơn hàng với discount của sản phẩm
export const calculateOrderValue = async (orderItems) => {
  let totalValue = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }
    
    const finalPrice = calculateFinalPrice(product.price, product.discount);
    totalValue += finalPrice * item.quantity;
  }

  return totalValue;
};

// Logic áp dụng voucher khi tạo đơn hàng
export const applyVoucherToOrder = async (orderData) => {
  try {
    const { voucherCode, orderItems } = orderData;
    let result = { ...orderData };

    // Nếu có voucher code, kiểm tra và áp dụng
    if (voucherCode && voucherCode.trim()) {
      // Tính tổng giá trị đơn hàng (đã bao gồm discount của sản phẩm)
      const orderValue = await calculateOrderValue(orderItems);
      
      // Áp dụng voucher
      const voucherResult = await voucherService.applyVoucher(voucherCode, orderValue);
      
      // Cập nhật order data với thông tin voucher
      result.voucherCode = voucherResult.voucher.code;
      result.voucherDiscount = voucherResult.discountAmount;
      result.itemsPrice = orderValue; // Giá sản phẩm đã có discount
      result.totalPrice = voucherResult.finalAmount + (result.shippingPrice || 0);
      
      // Đánh dấu voucher đã được sử dụng
      await voucherService.markVoucherAsUsed(voucherCode);
    } else {
      // Không có voucher, chỉ tính discount của sản phẩm
      const orderValue = await calculateOrderValue(orderItems);
      result.itemsPrice = orderValue;
      result.totalPrice = orderValue + (result.shippingPrice || 0);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Cập nhật stock và sold khi tạo đơn hàng với transaction để tránh race condition
export const updateProductStockOnOrderCreate = async (orderItems) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      for (const item of orderItems) {
        // Sử dụng findOneAndUpdate với session để đảm bảo atomic operation
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity }, // Chỉ cập nhật nếu stock đủ
            status: { $ne: "inactive" }, // Không cho phép đặt hàng sản phẩm inactive
          },
          {
            $inc: {
              stock: -item.quantity,
              sold: item.quantity,
            },
            $set: {
              status: {
                $cond: {
                  if: { $lte: [{ $subtract: ["$stock", item.quantity] }, 0] },
                  then: "out-of-stock",
                  else: "$status",
                },
              },
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          // Lấy thông tin sản phẩm để hiển thị lỗi chi tiết
          const product = await Product.findById(item.product).session(session);

          if (!product) {
            throw new Error(`Product with ID ${item.product} not found`);
          }

          if (product.status === "inactive") {
            throw new Error(
              `Product "${product.name}" is currently inactive and cannot be ordered`
            );
          }

          throw new Error(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }
      }
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

// Hoàn lại stock và sold khi hủy đơn hàng với transaction
export const revertProductStockOnOrderCancel = async (orderItems) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      for (const item of orderItems) {
        await Product.findOneAndUpdate(
          { _id: item.product },
          {
            $inc: {
              stock: item.quantity,
              sold: -item.quantity,
            },
            $set: {
              sold: { $max: [{ $subtract: ["$sold", item.quantity] }, 0] }, // Đảm bảo sold không âm
            },
          },
          {
            session,
            new: true,
          }
        );

        // Cập nhật status nếu có hàng trở lại
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gt: 0 },
            status: "out-of-stock",
          },
          {
            $set: { status: "active" },
          },
          { session }
        );
      }
    });
  } catch (error) {
    console.error("Error reverting product stock:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};
