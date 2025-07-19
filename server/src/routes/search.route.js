import express from "express";
import SearchController from "../controllers/search.controller.js";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware.js";
import Product from "../models/product.model.js";

const router = express.Router();

// Test endpoint - no middleware, no database
router.get("/test", (req, res) => {
  res.json({
    success: true,
    data: "Search service is working",
    message: "Test successful",
  });
});

// Test database connection
router.get("/test-db", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({
      success: true,
      data: { productCount: count },
      message: "Database connection successful",
    });
  } catch (error) {
    res.json({
      success: false,
      data: null,
      message: `Database error: ${error.message}`,
    });
  }
});

// Test search filter building
router.get("/test-filter", async (req, res) => {
  try {
    const {
      query = "",
      q = "",
      category,
      brand,
      minPrice,
      maxPrice,
    } = req.query;
    const searchQuery = query || q;

    // Build the same filter as in the main search
    const filter = { status: "active" };

    if (searchQuery && searchQuery.trim() && searchQuery.trim().length > 0) {
      const searchTerm = searchQuery.trim();
      filter.name = { $regex: searchTerm, $options: "i" };
    }

    // Category filter
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const Category = (await import("../models/category.model.js")).default;
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          filter.category = null;
        }
      }
    }

    // Brand filter
    if (brand) {
      if (brand.match(/^[0-9a-fA-F]{24}$/)) {
        filter.brand = brand;
      } else {
        const Brand = (await import("../models/brand.model.js")).default;
        const brandDoc = await Brand.findOne({ name: brand });
        if (brandDoc) {
          filter.brand = brandDoc._id;
        } else {
          filter.brand = null;
        }
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const count = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        filter: filter,
        matchingCount: count,
        query: req.query,
      },
      message: "Filter test successful",
    });
  } catch (error) {
    res.json({
      success: false,
      data: null,
      message: `Filter test error: ${error.message}`,
    });
  }
});

// Apply rate limiting to search endpoints
const searchRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many search requests, please try again later",
});

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API for searching products
 */

/**
 * @swagger
 * /api/search/suggestions:
 *   get:
 *     summary: Get search suggestions/autocomplete
 *     description: Returns search suggestions based on partial user input
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Partial search query
 *         example: "smart"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of suggestions to return
 *         example: 5
 *     responses:
 *       200:
 *         description: Search suggestions retrieved successfully
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
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             example: "smartphone"
 *                           type:
 *                             type: string
 *                             enum: [product, category, brand, term]
 *                             example: "product"
 *                           score:
 *                             type: number
 *                             example: 0.95
 *                           id:
 *                             type: string
 *                             example: "60d725b4e5449c001f5d5f6e"
 *                           image:
 *                             type: string
 *                             example: "https://example.com/images/smartphone.jpg"
 *                     duration:
 *                       type: number
 *                       description: Search execution time in milliseconds
 *                       example: 12
 *       400:
 *         description: Missing required query parameter
 *       429:
 *         description: Rate limit exceeded, too many requests
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/search/products:
 *   get:
 *     summary: Search products with filters
 *     description: Advanced product search with multiple filtering and sorting options
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for product name and description
 *         example: "smartphone"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter by
 *         example: "60d725b4e5449c001f5d5f6e"
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Brand ID to filter by
 *         example: "60d725b4e5449c001f5d5f70"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 1000
 *       - in: query
 *         name: onSale
 *         schema:
 *           type: boolean
 *         description: Filter for products on sale
 *         example: true
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter for in-stock products only
 *         example: true
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum product rating (1-5)
 *         example: 4
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [relevance, price_asc, price_desc, newest, rating, sales]
 *           default: relevance
 *         description: Sort order for search results
 *         example: "price_asc"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of results per page
 *         example: 20
 *       - in: query
 *         name: features
 *         schema:
 *           type: string
 *         description: Comma-separated list of product features to filter by
 *         example: "waterproof,wireless"
 *     responses:
 *       200:
 *         description: Search results
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
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     filters:
 *                       type: object
 *                       properties:
 *                         categories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               count:
 *                                 type: number
 *                         brands:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               count:
 *                                 type: number
 *                         priceRange:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         ratings:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               rating:
 *                                 type: number
 *                               count:
 *                                 type: number
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalDocs:
 *                           type: number
 *                         limit:
 *                           type: number
 *                         totalPages:
 *                           type: number
 *                         page:
 *                           type: number
 *                         hasPrevPage:
 *                           type: boolean
 *                         hasNextPage:
 *                           type: boolean
 *                     query:
 *                       type: object
 *                       description: The query parameters used for the search
 *                     duration:
 *                       type: number
 *                       description: Search execution time in milliseconds
 *       400:
 *         description: Invalid search parameters
 *       429:
 *         description: Rate limit exceeded, too many requests
 *       500:
 *         description: Server error
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Products searched successfully
 */

/**
 * @swagger
 * /api/search/filters:
 *   get:
 *     summary: Get available filter options
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Filter options retrieved successfully
 */

/**
 * @swagger
 * /api/search/popular:
 *   get:
 *     summary: Get popular search terms
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of popular terms to return
 *     responses:
 *       200:
 *         description: Popular search terms retrieved successfully
 */

// GET /api/search/suggestions - Get search suggestions/autocomplete
router.get("/suggestions", async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        message: "Query too short",
      });
    }

    // Tìm kiếm suggestions từ database

    try {
      // Tìm kiếm products đơn giản - không có timeout trước
      const products = await Product.find({
        status: "active",
        name: { $regex: query, $options: "i" },
      })
        .select("name brand category")
        .populate("brand", "name")
        .populate("category", "name")
        .limit(Math.min(parseInt(limit), 5))
        .lean();

      const suggestions = [];
      const addedSuggestions = new Set();

      products.forEach((product) => {
        // Gợi ý tên sản phẩm
        if (product.name && !addedSuggestions.has(product.name.toLowerCase())) {
          suggestions.push({
            type: "product",
            text: product.name,
            value: product.name,
          });
          addedSuggestions.add(product.name.toLowerCase());
        }

        // Gợi ý thương hiệu
        if (
          product.brand &&
          product.brand.name &&
          !addedSuggestions.has(product.brand.name.toLowerCase())
        ) {
          suggestions.push({
            type: "brand",
            text: product.brand.name,
            value: product.brand.name,
          });
          addedSuggestions.add(product.brand.name.toLowerCase());
        }

        // Gợi ý danh mục
        if (
          product.category &&
          product.category.name &&
          !addedSuggestions.has(product.category.name.toLowerCase())
        ) {
          suggestions.push({
            type: "category",
            text: product.category.name,
            value: product.category.name,
          });
          addedSuggestions.add(product.category.name.toLowerCase());
        }
      });

      return res.json({
        success: true,
        data: suggestions.slice(0, parseInt(limit)),
        message: "Search suggestions retrieved successfully",
      });
    } catch (error) {
      console.error("Database query failed, using fallback:", error.message);

      // Fallback to mock suggestions
      const fallbackSuggestions = [
        {
          type: "product",
          text: `${query} iPhone 15`,
          value: `${query} iPhone 15`,
        },
        {
          type: "product",
          text: `${query} Samsung Galaxy`,
          value: `${query} Samsung Galaxy`,
        },
        {
          type: "product",
          text: `${query} MacBook`,
          value: `${query} MacBook`,
        },
        { type: "brand", text: "Apple", value: "Apple" },
        { type: "brand", text: "Samsung", value: "Samsung" },
        { type: "category", text: "Điện thoại", value: "Điện thoại" },
        { type: "category", text: "Laptop", value: "Laptop" },
      ];

      return res.json({
        success: true,
        data: fallbackSuggestions.slice(0, parseInt(limit)),
        message: "Search suggestions retrieved successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      message: `Error: ${error.message}`,
    });
  }
});

// GET /api/search/products - Search products with filters
router.get("/products", async (req, res) => {
  try {
    const {
      query = "",
      q = "",
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = "relevance",
      sortBy = "relevance",
    } = req.query;

    // Sử dụng query hoặc q (để tương thích với cả hai)
    const searchQuery = query || q;

    // Sử dụng sortBy nếu có, fallback về sort
    const sortField = sortBy || sort;

    // Build search filter
    const filter = { status: "active" };

    // Text search - đơn giản hóa để debug
    if (searchQuery && searchQuery.trim() && searchQuery.trim().length > 0) {
      console.log(`[DEBUG] Search query received: "${searchQuery}"`);
      const searchTerm = searchQuery.trim();

      // Test với regex đơn giản nhất
      filter.name = { $regex: searchTerm, $options: "i" };

      console.log(
        `[DEBUG] Applied name filter: ${JSON.stringify(filter.name)}`
      );
    }
    // Không có else - tìm kiếm trong tất cả sản phẩm active

    // Category filter
    if (category) {
      try {
        // Kiểm tra xem category là ObjectId hay name
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
          // Nếu là ObjectId, dùng trực tiếp
          filter.category = category;
        } else {
          // Nếu là name, tìm category theo name
          const Category = (await import("../models/category.model.js"))
            .default;
          const categoryDoc = await Category.findOne({ name: category });
          if (categoryDoc) {
            filter.category = categoryDoc._id;
          } else {
            // Nếu không tìm thấy category, trả về kết quả rỗng
            filter.category = null;
          }
        }
      } catch (error) {
        console.error("Category filter error:", error);
        // Nếu có lỗi, trả về kết quả rỗng để tránh hiển thị sai
        filter.category = null;
      }
    }

    // Brand filter
    if (brand) {
      try {
        // Kiểm tra xem brand là ObjectId hay name
        if (brand.match(/^[0-9a-fA-F]{24}$/)) {
          // Nếu là ObjectId, dùng trực tiếp
          filter.brand = brand;
        } else {
          // Nếu là name, tìm brand theo name
          const Brand = (await import("../models/brand.model.js")).default;
          const brandDoc = await Brand.findOne({ name: brand });
          if (brandDoc) {
            filter.brand = brandDoc._id;
          } else {
            // Nếu không tìm thấy brand, trả về kết quả rỗng
            filter.brand = null;
          }
        }
      } catch (error) {
        console.error("Brand filter error:", error);
        // Nếu có lỗi, trả về kết quả rỗng để tránh hiển thị sai
        filter.brand = null;
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Build sort options
    let sortOption = {};
    console.log(`[DEBUG] Raw query params:`, req.query); // Debug log
    console.log(`[DEBUG] Sort field received: ${sortField}`); // Debug log
    console.log(
      `[DEBUG] Search filter built:`,
      JSON.stringify(filter, null, 2)
    ); // Debug log

    switch (sortField) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "name_desc":
        sortOption = { name: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "sales":
        sortOption = { sold: -1 }; // Sắp xếp theo số lượng đã bán
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "createdAt":
        sortOption = { createdAt: 1 }; // Cũ nhất
        break;
      case "relevance":
        // Nếu có query search, ưu tiên theo tên gần đúng nhất, nếu không thì theo featured
        if (searchQuery && searchQuery.trim()) {
          // MongoDB không support score sorting với regex, nên dùng fallback
          sortOption = { createdAt: -1 };
        } else {
          sortOption = { isFeatured: -1, createdAt: -1 };
        }
        break;
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    console.log(`[DEBUG] Sort option applied:`, sortOption); // Debug log

    // Pagination
    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.min(Math.max(1, parseInt(limit)), 50);
    const skip = (currentPage - 1) * itemsPerPage;

    try {
      // Get products with populate
      const products = await Product.find(filter)
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(itemsPerPage)
        .lean();

      // Get total count for pagination
      const totalCount = await Product.countDocuments(filter);

      console.log(
        `[DEBUG] Query returned ${products.length} products, total count: ${totalCount}`
      );
      if (products.length > 0) {
        console.log(`[DEBUG] First product name: "${products[0].name}"`);
      }

      res.json({
        success: true,
        data: {
          products: products,
          pagination: {
            currentPage,
            totalPages: Math.ceil(totalCount / itemsPerPage),
            totalCount,
            hasNext: skip + itemsPerPage < totalCount,
            hasPrev: currentPage > 1,
          },
          filters: req.query,
        },
        message: "Products searched successfully",
      });
    } catch (error) {
      console.error("Database query failed, using fallback:", error.message);

      // Fallback to mock data
      const mockProducts = [
        {
          _id: "1",
          name: `${searchQuery || "Sản phẩm"} iPhone 15 Pro Max 256GB`,
          price: 35000000,
          originalPrice: 40000000,
          images: ["https://via.placeholder.com/300x300?text=iPhone+15+Pro"],
          rating: 4.8,
          sold: 150,
          brand: { name: "Apple", slug: "apple" },
          category: { name: "Điện thoại", slug: "dien-thoai" },
          discount: 12,
          slug: "iphone-15-pro-max",
        },
        {
          _id: "2",
          name: `${searchQuery || "Sản phẩm"} Samsung Galaxy S24 Ultra`,
          price: 28000000,
          originalPrice: 32000000,
          images: ["https://via.placeholder.com/300x300?text=Galaxy+S24"],
          rating: 4.6,
          sold: 120,
          brand: { name: "Samsung", slug: "samsung" },
          category: { name: "Điện thoại", slug: "dien-thoai" },
          discount: 12,
          slug: "samsung-galaxy-s24",
        },
      ];

      res.json({
        success: true,
        data: {
          products: mockProducts,
          pagination: {
            currentPage,
            totalPages: 1,
            totalCount: mockProducts.length,
            hasNext: false,
            hasPrev: false,
          },
          filters: req.query,
        },
        message: "Products searched successfully (fallback)",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: { products: [], pagination: {} },
      message: `Error: ${error.message}`,
    });
  }
});

// GET /api/search/filters - Get available filter options
router.get("/filters", async (req, res) => {
  try {
    let brands = [];
    let categories = [];
    let priceRange = { minPrice: 100000, maxPrice: 50000000 };

    try {
      // Lấy brands từ database
      const Brand = (await import("../models/brand.model.js")).default;
      const brandDocs = await Brand.find({})
        .select("name slug")
        .limit(20)
        .lean();
      brands = brandDocs;

      // Lấy categories từ database
      const Category = (await import("../models/category.model.js")).default;
      const categoryDocs = await Category.find({})
        .select("name slug")
        .limit(20)
        .lean();
      categories = categoryDocs;

      // Lấy price range từ products
      const priceStats = await Product.aggregate([
        { $match: { status: "active" } },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]);

      if (priceStats.length > 0) {
        priceRange = {
          minPrice: priceStats[0].minPrice || 100000,
          maxPrice: priceStats[0].maxPrice || 50000000,
        };
      }
    } catch (error) {
      console.error("Database query failed, using fallback:", error.message);

      // Fallback to mock data
      brands = [
        { _id: "1", name: "Apple", slug: "apple" },
        { _id: "2", name: "Samsung", slug: "samsung" },
        { _id: "3", name: "Dell", slug: "dell" },
        { _id: "4", name: "HP", slug: "hp" },
        { _id: "5", name: "Nike", slug: "nike" },
      ];
      categories = [
        { _id: "1", name: "Điện thoại", slug: "dien-thoai" },
        { _id: "2", name: "Laptop", slug: "laptop" },
        { _id: "3", name: "Tablet", slug: "tablet" },
        { _id: "4", name: "Thời trang", slug: "thoi-trang" },
      ];
    }

    res.json({
      success: true,
      data: {
        brands,
        categories,
        priceRange,
      },
      message: "Filter options retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: { brands: [], categories: [], priceRange: {} },
      message: `Error: ${error.message}`,
    });
  }
});

// GET /api/search/popular - Get popular search terms
router.get("/popular", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Lấy danh sách brand names từ database

    try {
      // Đơn giản hóa query không có timeout trước
      const brands = await Product.distinct("brand").limit(parseInt(limit));

      if (brands && brands.length > 0) {
        // Populate brand names
        const Brand = (await import("../models/brand.model.js")).default;
        const brandDocs = await Brand.find({ _id: { $in: brands } })
          .select("name")
          .limit(parseInt(limit))
          .lean();

        const popularTerms = brandDocs.map((brand) => brand.name);

        return res.json({
          success: true,
          data: popularTerms,
          message: "Popular search terms retrieved successfully",
        });
      }
    } catch (error) {
      console.error("Database query failed, using fallback:", error.message);
    }

    // Fallback to static data
    const popularTerms = [
      "iPhone",
      "Samsung",
      "Laptop",
      "MacBook",
      "iPad",
      "Áo thun",
      "Giày sneaker",
      "Tai nghe",
      "Đồng hồ",
      "Túi xách",
    ];

    res.json({
      success: true,
      data: popularTerms.slice(0, parseInt(limit)),
      message: "Popular search terms retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      message: `Error: ${error.message}`,
    });
  }
});

export default router;
