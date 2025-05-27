import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    // Thêm trường categories để lưu danh sách các danh mục liên quan
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware tạo slug tự động trước khi lưu
brandSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next(); // chỉ tạo slug nếu name mới

  // Tạo slug kèm timestamp để đảm bảo tính duy nhất
  this.slug = `${slugify(this.name, {
    lower: true,
    strict: true,
  })}-${Date.now()}`;
  next();
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
