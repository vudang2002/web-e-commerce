import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "daoxcmuum",
  api_key: process.env.CLOUDINARY_API_KEY || "592485799743899",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "8A6PNHZJ9qPwf6b03rzqaITsUt8",
});

export default cloudinary;
