import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../../src/models/order.model.js";
import Product from "../../src/models/product.model.js";
import User from "../../src/models/user.model.js";
import {
  createOrder,
  updateOrderStatus,
  markAsPaid,
  refundOrder,
} from "../../src/services/order.service.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Order.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
});

describe("Order Service", () => {
  it("should create an order successfully", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password",
    });

    const product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "test-product",
    });

    const orderData = {
      user: user._id,
      orderItems: [{ product: product._id, quantity: 2 }],
      shippingInfo: { address: "123 Main St", phoneNo: "1234567890" },
      paymentMethod: "COD",
      itemsPrice: 200,
      shippingPrice: 10,
      totalPrice: 210,
      orderStatus: "Processing", // Valid enum value
    };

    const order = await createOrder(orderData);

    expect(order).toBeDefined();
    expect(order.user.toString()).toBe(user._id.toString());
    expect(order.orderItems.length).toBe(1);
    expect(order.totalPrice).toBe(210);
  });

  it("should update order status", async () => {
    const order = await Order.create({
      user: new mongoose.Types.ObjectId(),
      orderItems: [],
      shippingInfo: { address: "123 Main St", phoneNo: "1234567890" },
      paymentMethod: "COD",
      itemsPrice: 100,
      shippingPrice: 10,
      totalPrice: 110,
      orderStatus: "Processing", // Valid enum value
    });

    const updatedOrder = await updateOrderStatus(order._id, "Shipping");

    expect(updatedOrder.orderStatus).toBe("Shipping");
  });

  it("should mark an order as paid", async () => {
    const order = await Order.create({
      user: new mongoose.Types.ObjectId(),
      orderItems: [],
      shippingInfo: { address: "123 Main St", phoneNo: "1234567890" },
      paymentMethod: "COD",
      itemsPrice: 100,
      shippingPrice: 10,
      totalPrice: 110,
      isPaid: false,
    });

    const updatedOrder = await markAsPaid(order._id);

    expect(updatedOrder.isPaid).toBe(true);
  });

  it("should refund an order", async () => {
    const order = await Order.create({
      user: new mongoose.Types.ObjectId(),
      orderItems: [],
      shippingInfo: { address: "123 Main St", phoneNo: "1234567890" },
      paymentMethod: "COD",
      itemsPrice: 100,
      shippingPrice: 10,
      totalPrice: 110,
      isRefunded: false,
    });

    const updatedOrder = await refundOrder(order._id);

    expect(updatedOrder.isRefunded).toBe(true);
  });
});
