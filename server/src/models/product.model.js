import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    normalizedName: { type: String }, // Tên sản phẩm không dấu để tìm kiếm
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String },
    tags: [{ type: String }], // Tags để tìm kiếm
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
    discount: {
      type: Number, // phần trăm giảm giá, ví dụ: 20 = 20%
      default: 0,
      min: 0,
      max: 100,
    },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
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

// Middleware tạo slug và normalizedName tự động trước khi lưu
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    // Tạo slug kèm timestamp để đảm bảo tính duy nhất
    this.slug = `${slugify(this.name, {
      lower: true,
      strict: true,
    })}-${Date.now()}`;

    // Tạo normalizedName để tìm kiếm không dấu
    this.normalizedName = this.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }
  next();
});

// Virtual field để tính giá sau khi giảm
productSchema.virtual("discountedPrice").get(function () {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Virtual field để tính số tiền được giảm
productSchema.virtual("discountAmount").get(function () {
  if (this.discount > 0) {
    return Math.round(this.price * (this.discount / 100));
  }
  return 0;
});

// Virtual field để kiểm tra có đang giảm giá không
productSchema.virtual("isOnSale").get(function () {
  return this.discount > 0;
});

// Đảm bảo virtual fields được bao gồm khi convert to JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Thêm indexes để tối ưu hóa tìm kiếm
productSchema.index({ name: "text", description: "text", tags: "text" }); // Text index để tìm kiếm nhanh
productSchema.index({ normalizedName: 1 }); // Index cho tìm kiếm không dấu
productSchema.index({ category: 1 }); // Index cho tìm kiếm theo danh mục
productSchema.index({ brand: 1 }); // Index cho tìm kiếm theo thương hiệu
productSchema.index({ price: 1 }); // Index cho tìm kiếm và sắp xếp theo giá
productSchema.index({ discount: 1 }); // Index cho tìm kiếm theo discount
productSchema.index({ createdAt: -1 }); // Index cho sắp xếp theo ngày tạo
// slug đã có unique: true trong schema, không cần thêm index riêng
productSchema.index({ isFeatured: 1 }); // Index cho việc tìm kiếm sản phẩm nổi bật
productSchema.index({ status: 1 }); // Index cho tìm kiếm theo status
productSchema.index({ tags: 1 }); // Index cho tìm kiếm theo tags

const Product = mongoose.model("Product", productSchema);
export default Product;
