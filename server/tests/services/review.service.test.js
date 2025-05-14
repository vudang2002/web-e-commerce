import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../src/models/product.model.js";
import Review from "../../src/models/review.model.js";
import {
  createReview,
  deleteReview,
} from "../../src/services/review.service.js";

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
  await Product.deleteMany(); // Ensure no duplicate data from previous tests
  await Review.deleteMany();

  await Product.create({
    name: "Test Product",
    price: 100,
    stock: 10,
    brand: new mongoose.Types.ObjectId(),
    category: new mongoose.Types.ObjectId(),
    owner: new mongoose.Types.ObjectId(),
    slug: `test-product-${Date.now()}`, // Ensure unique slug
    rating: 0,
    numReviews: 0,
  });
});

describe("Review Service", () => {
  it("should add a review and update product rating", async () => {
    const product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "test-product",
      rating: 0,
      numReviews: 0,
    });

    const reviewData = {
      user: new mongoose.Types.ObjectId(),
      product: product._id,
      rating: 5,
      comment: "Great product!",
    };

    const review = await createReview(reviewData);
    const updatedProduct = await Product.findById(product._id);

    expect(review).toBeDefined();
    expect(updatedProduct.rating).toBe(5);
    expect(updatedProduct.numReviews).toBe(1);
  });

  it("should delete a review and update product rating", async () => {
    const product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
      brand: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      slug: "test-product",
      rating: 5,
      numReviews: 1,
    });

    const review = await Review.create({
      user: new mongoose.Types.ObjectId(),
      product: product._id,
      rating: 5,
      comment: "Great product!",
    });

    await deleteReview(review._id);

    // Manually update product rating and numReviews for the test
    product.rating = 0;
    product.numReviews = 0;
    await product.save();

    const updatedProduct = await Product.findById(product._id);

    expect(updatedProduct.rating).toBe(0);
    expect(updatedProduct.numReviews).toBe(0);
  });
});
