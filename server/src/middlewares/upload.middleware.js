import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

// Upload avatar user
export const uploadUserAvatar = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "avatars",
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  }),
});

// Upload ảnh brand
export const uploadBrandImage = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "brands",
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  }),
});

// Upload ảnh category
export const uploadCategoryImage = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "categories",
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  }),
});

// Upload ảnh sản phẩm
export const uploadProductImage = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "products",
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  }),
});

// Upload ảnh review
export const uploadReviewImage = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "reviews",
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  }),
});

// Nếu muốn giữ middleware cũ cho trường hợp upload chung
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

export default upload;
