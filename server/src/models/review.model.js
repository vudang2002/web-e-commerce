import mongoose from "mongoose";
import Product from "./product.model.js";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: [{ type: String, trim: true, maxlength: 5 }], // Tối đa 5 ảnh
  },
  { timestamps: true }
);

// Đảm bảo mỗi user chỉ review 1 sản phẩm 1 lần
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Tự động cập nhật rating trung bình và số lượng đánh giá trong Product
reviewSchema.post("save", async function () {
  const reviews = await this.constructor.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (reviews.length > 0) {
    const { avgRating, numReviews } = reviews[0];
    await Product.findByIdAndUpdate(this.product, {
      rating: avgRating,
      numReviews,
    });
  }
});

reviewSchema.post("remove", async function () {
  const reviews = await this.constructor.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (reviews.length > 0) {
    const { avgRating, numReviews } = reviews[0];
    await Product.findByIdAndUpdate(this.product, {
      rating: avgRating,
      numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(this.product, { rating: 0, numReviews: 0 });
  }
});

export default mongoose.model("Review", reviewSchema);
