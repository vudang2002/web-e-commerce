import request from "supertest";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../../src/models/order.model.js";
import Product from "../../src/models/product.model.js";
import User from "../../src/models/user.model.js";

let mongoServer;
let token;

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

  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password",
  });

  // Generate a token for the user
  token = "Bearer " + user.generateAuthToken();
});

describe("Order Controller", () => {
  it("should create a new order", async () => {
    const user = await User.findOne({ email: "test@example.com" });

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
      items: [{ productId: product._id, quantity: 2 }],
      shippingAddress: { address: "123 Main St", phoneNo: "1234567890" },
      paymentMethod: "COD",
      itemsPrice: 200,
      shippingPrice: 10,
      totalPrice: 210,
    };

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", token)
      .send(orderData)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.data.totalPrice).toBe(210);
  });

  it("should get an order by ID", async () => {
    const user = await User.findOne({ email: "test@example.com" });

    const product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "test-product",
    });

    const order = await Order.create({
      user: user._id,
      items: [{ productId: product._id, quantity: 2 }],
      shippingAddress: { address: "123 Main St", phoneNo: "1234567890" },
      paymentMethod: "COD",
      itemsPrice: 200,
      shippingPrice: 10,
      totalPrice: 210,
    });

    const response = await request(app)
      .get(`/api/orders/${order._id}`)
      .set("Authorization", token)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.data._id).toBe(order._id.toString());
  });
});
