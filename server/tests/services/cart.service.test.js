import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Cart from "../../src/models/cart.model.js";
import Product from "../../src/models/product.model.js";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../../src/services/cart.service.js";

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
  await Product.deleteMany(); // Clear all products to avoid duplicate slug errors
  await Cart.deleteMany(); // Clear all carts to ensure clean state

  await Product.create({
    name: "Test Product",
    price: 100,
    stock: 10,
    brand: new mongoose.Types.ObjectId(),
    category: new mongoose.Types.ObjectId(),
    owner: new mongoose.Types.ObjectId(),
    slug: "unique-test-product",
  });
});

describe("Cart Service", () => {
  it("should add a product to the cart", async () => {
    const userId = new mongoose.Types.ObjectId();
    const product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "test-product",
    });

    const cart = await addToCart(userId, product._id, 2);

    expect(cart).toBeDefined();
    expect(cart.cartItems.length).toBe(1);
    expect(cart.cartItems[0].product.toString()).toBe(product._id.toString());
    expect(cart.cartItems[0].quantity).toBe(2);
  });

  it("should update the quantity of a product in the cart", async () => {
    const userId = new mongoose.Types.ObjectId();
    const product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "test-product-update",
    });

    // Add the product to the cart
    const cart = await addToCart(userId, product._id, 2);
    expect(cart.cartItems.length).toBe(1);
    expect(cart.cartItems[0].product.toString()).toBe(product._id.toString());

    // Update the quantity of the product in the cart
    const updatedCart = await updateCartItem(userId, product._id, 5);

    expect(updatedCart.cartItems[0].quantity).toBe(5);
  });

  it("should remove a product from the cart", async () => {
    const userId = new mongoose.Types.ObjectId();
    const product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "test-product",
    });

    await addToCart(userId, product._id, 2);
    const updatedCart = await removeFromCart(userId, product._id);

    expect(updatedCart.cartItems.length).toBe(0);
  });
});
