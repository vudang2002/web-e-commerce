import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../src/models/product.model.js";
import {
  createProduct,
  updateProduct,
  getProducts,
} from "../../src/services/product.service.js";

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

  await Product.create({
    name: "Existing Product",
    price: 100,
    stock: 10,
    brand: new mongoose.Types.ObjectId(),
    category: new mongoose.Types.ObjectId(),
    owner: new mongoose.Types.ObjectId(),
    slug: "existing-product",
  });
});

describe("Product Service", () => {
  it("should create a product successfully", async () => {
    const productData = {
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(), // Added required field
      slug: "test-product", // Added required field
    };

    const product = await createProduct(productData);

    expect(product).toBeDefined();
    expect(product.name).toBe("Test Product");
    expect(product.price).toBe(100);
  });

  it("should update a product successfully", async () => {
    const product = await Product.create({
      name: "Old Product",
      price: 50,
      stock: 5,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "old-product",
    });

    const updatedProduct = await updateProduct(product._id, {
      name: "Updated Product",
      price: 150,
    });

    expect(updatedProduct.name).toBe("Updated Product");
    expect(updatedProduct.price).toBe(150);
  });

  it("should filter products by brand and category", async () => {
    const brandId = new mongoose.Types.ObjectId();
    const categoryId = new mongoose.Types.ObjectId();

    await Product.create({
      name: "Product 1",
      price: 100,
      stock: 10,
      brand: brandId,
      category: categoryId,
      owner: new mongoose.Types.ObjectId(),
      slug: "product-1",
    });

    await Product.create({
      name: "Product 2",
      price: 200,
      stock: 5,
      brand: brandId,
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "product-2",
    });

    const products = await getProducts({
      brand: brandId,
      category: categoryId,
    });

    expect(products.products.length).toBe(1);
    expect(products.products[0].name).toBe("Product 1");
  });
});
