import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
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
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware tạo slug tự động trước khi lưu
categorySchema.pre("save", function (next) {
  if (!this.isModified("name")) return next(); // chỉ tạo slug nếu name mới

  // Tạo slug kèm timestamp để đảm bảo tính duy nhất
  this.slug = `${slugify(this.name, {
    lower: true,
    strict: true,
  })}-${Date.now()}`;
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
