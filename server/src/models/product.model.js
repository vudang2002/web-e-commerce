import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    attributes: [
      {
        key: { type: String, required: true },
        value: [{ type: String, required: true }],
      },
    ],
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock"],
      default: "active",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware tạo slug tự động trước khi lưu
productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next(); // chỉ tạo slug nếu name mới

  // Tạo slug kèm timestamp để đảm bảo tính duy nhất
  this.slug = `${slugify(this.name, {
    lower: true,
    strict: true,
  })}-${Date.now()}`;
  next();
});

// Thêm indexes để tối ưu hóa tìm kiếm
productSchema.index({ name: "text", description: "text" }); // Text index để tìm kiếm nhanh
productSchema.index({ category: 1 }); // Index cho tìm kiếm theo danh mục
productSchema.index({ brand: 1 }); // Index cho tìm kiếm theo thương hiệu
productSchema.index({ price: 1 }); // Index cho tìm kiếm và sắp xếp theo giá
productSchema.index({ createdAt: -1 }); // Index cho sắp xếp theo ngày tạo
productSchema.index({ slug: 1 }, { unique: true }); // Đảm bảo slug là duy nhất
productSchema.index({ isFeatured: 1 }); // Index cho việc tìm kiếm sản phẩm nổi bật

const Product = mongoose.model("Product", productSchema);
export default Product;
