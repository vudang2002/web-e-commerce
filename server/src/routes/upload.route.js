import express from "express";
import upload, {
  uploadUserAvatar,
  uploadBrandImage,
  uploadCategoryImage,
  uploadProductImage,
  uploadReviewImage,
} from "../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: API cho upload ảnh lên Cloudinary
 */

/**
 * @swagger
 * /api/upload/upload:
 *   post:
 *     summary: Upload a single image to Cloudinary
 *     description: Upload a general-purpose image to Cloudinary storage
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPG, PNG, WEBP, max 2MB)
 *     responses:
 *       200:
 *         description: Returns the URL of the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/ecommerce_uploads/abc.jpg
 *                     public_id:
 *                       type: string
 *                       example: ecommerce_uploads/abc
 *                     format:
 *                       type: string
 *                       example: jpg
 *                     resource_type:
 *                       type: string
 *                       example: image
 *       400:
 *         description: No file uploaded or invalid file format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: No file uploaded or Invalid file format
 *       401:
 *         description: Unauthorized, authentication required
 *       413:
 *         description: File too large (max 2MB)
 *       500:
 *         description: Server error during upload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 *
 * /api/upload/avatar:
 *   post:
 *     summary: Upload avatar user (1 ảnh)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Trả về URL avatar đã upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: Không có file được upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /api/upload/brand:
 *   post:
 *     summary: Upload ảnh brand (1 ảnh)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Trả về URL logo đã upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: Không có file được upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /api/upload/category:
 *   post:
 *     summary: Upload ảnh category (1 ảnh)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Trả về URL ảnh category đã upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: Không có file được upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /api/upload/product:
 *   post:
 *     summary: Upload nhiều ảnh product (tối đa 10 ảnh)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Trả về danh sách URL ảnh đã upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Không có file được upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /api/upload/review:
 *   post:
 *     summary: Upload nhiều ảnh review (tối đa 5 ảnh)
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Trả về danh sách URL ảnh đã upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Không có file được upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

// Đường dẫn upload ảnh
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Ảnh đã được upload lên Cloudinary, trả về URL
  res.json({ url: req.file.path });
});

// Upload avatar user (1 ảnh)
router.post("/avatar", uploadUserAvatar.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: req.file.path });
});

// Upload ảnh brand (1 ảnh)
router.post("/brand", uploadBrandImage.single("logo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: req.file.path });
});

// Upload ảnh category (1 ảnh)
router.post("/category", uploadCategoryImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ url: req.file.path });
});

// Upload nhiều ảnh product (tối đa 10 ảnh)
router.post("/product", uploadProductImage.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const urls = req.files.map((file) => file.path);
  res.json({ urls });
});

// Upload nhiều ảnh review (tối đa 5 ảnh)
router.post("/review", uploadReviewImage.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const urls = req.files.map((file) => file.path);
  res.json({ urls });
});

export default router;
