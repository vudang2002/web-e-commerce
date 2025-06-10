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

export const getOrdersByUser = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: userId })
    .populate("orderItems.product")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: userId });

  return {
    orders,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
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

export const updateOrder = async (orderId, updateData) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Update order items if provided
  if (updateData.items && Array.isArray(updateData.items)) {
    const orderItems = await Promise.all(
      updateData.items.map(async (item) => {
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
    order.orderItems = orderItems;
  }

  // Update shipping info if provided
  if (updateData.shippingInfo) {
    order.shippingInfo = {
      ...order.shippingInfo,
      ...updateData.shippingInfo,
    };
  }

  // Update other fields if provided
  if (updateData.paymentMethod) {
    order.paymentMethod = updateData.paymentMethod;
  }

  if (updateData.orderStatus) {
    order.orderStatus = updateData.orderStatus;
    if (updateData.orderStatus === "Delivered") {
      order.deliveredAt = new Date();
    }
  }

  // Recalculate order value if items were updated
  if (updateData.items) {
    const orderValue = await calculateOrderValue(order.orderItems);
    order.totalPrice = orderValue + order.shippingPrice;
  }

  return await order.save();
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
      const voucherResult = await voucherService.applyVoucher(
        voucherCode,
        orderValue
      );

      // Cập nhật order data với thông tin voucher
      result.voucherCode = voucherResult.voucher.code;
      result.voucherDiscount = voucherResult.discountAmount;
      result.itemsPrice = orderValue; // Giá sản phẩm đã có discount
      result.totalPrice =
        voucherResult.finalAmount + (result.shippingPrice || 0);

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
        // Lấy thông tin sản phẩm trước khi cập nhật
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          throw new Error(`Product with ID ${item.product} not found`);
        }

        if (product.status === "inactive") {
          throw new Error(
            `Product "${product.name}" is currently inactive and cannot be ordered`
          );
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }

        // Cập nhật stock và sold
        const newStock = product.stock - item.quantity;
        const updateData = {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        };

        // Nếu stock về 0 thì chuyển status thành out-of-stock
        if (newStock <= 0) {
          updateData.$set = { status: "out-of-stock" };
        }

        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity }, // Đảm bảo stock vẫn đủ
          },
          updateData,
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          throw new Error(
            `Failed to update product stock. This may be due to insufficient stock or concurrent orders.`
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
        // Cập nhật stock và sold
        await Product.findOneAndUpdate(
          { _id: item.product },
          {
            $inc: {
              stock: item.quantity,
              sold: -item.quantity,
            },
          },
          {
            session,
            new: true,
          }
        );

        // Cập nhật status nếu có hàng trở lại và hiện tại đang out-of-stock
        await Product.findOneAndUpdate(
          {
            _id: item.product,
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
