import Product from "../models/product.model.js";
import { removeVietnameseTones } from "../utils/textUtils.js";

class SearchService {
  // Tìm kiếm gợi ý (autocomplete)
  static async getSearchSuggestions(query, limit = 10) {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const normalizedQuery = removeVietnameseTones(query.toLowerCase());

      // Giới hạn thời gian thực thi truy vấn
      const timeout = 2000; // 2 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), timeout)
      );
      // Đảm bảo queryPromise luôn là một Promise
      let queryPromise;
      try {
        queryPromise = Product.find({
          status: "active",
          $or: [
            { name: { $regex: query, $options: "i" } },
            { normalizedName: { $regex: normalizedQuery, $options: "i" } },
          ],
        })
          .select("name brand category")
          .populate("brand", "name")
          .populate("category", "name")
          .limit(limit)
          .lean();
      } catch (err) {
        console.error("Error building query:", err.message);
        return [];
      }

      // Thực hiện truy vấn với timeout
      let products = [];
      try {
        products = await Promise.race([queryPromise, timeoutPromise]);
      } catch (error) {
        console.error(
          "Search suggestion query timed out or failed:",
          error.message
        );
        return [];
      }

      // Tạo danh sách gợi ý
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

      return suggestions.slice(0, limit);
    } catch (error) {
      console.error("Error getting search suggestions:", error.message);
      return [];
    }
  }
  // Tìm kiếm toàn văn bản với filter
  static async searchProducts(filters = {}) {
    try {
      const {
        query = "",
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy = "relevance",
        page = 1,
        limit = 20,
      } = filters;

      // Giới hạn thời gian thực thi truy vấn
      const timeout = 3000; // 3 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), timeout)
      );

      const skip = (page - 1) * limit;
      let searchConditions = { status: "active" };

      // Xây dựng điều kiện tìm kiếm (đơn giản hoá)
      if (query && query.trim()) {
        const normalizedQuery = removeVietnameseTones(query.toLowerCase());
        searchConditions.$or = [
          { name: { $regex: query, $options: "i" } },
          { normalizedName: { $regex: normalizedQuery, $options: "i" } },
        ];
      }
      if (category) {
        searchConditions.category = category;
      }
      if (brand) {
        searchConditions.brand = brand;
      }
      if (minPrice || maxPrice) {
        searchConditions.price = {};
        if (minPrice) searchConditions.price.$gte = Number(minPrice);
        if (maxPrice) searchConditions.price.$lte = Number(maxPrice);
      }
      // Xây dựng sort conditions
      let sortConditions = {};
      switch (sortBy) {
        case "price_asc":
          sortConditions = { price: 1 };
          break;
        case "price_desc":
          sortConditions = { price: -1 };
          break;
        case "newest":
          sortConditions = { createdAt: -1 };
          break;
        case "rating":
          sortConditions = { rating: -1 };
          break;
        case "sales":
          sortConditions = { sold: -1 };
          break;
        default:
          sortConditions = { createdAt: -1 };
          break;
      }
      // Thực hiện tìm kiếm với timeout
      let queryPromise;
      try {
        queryPromise = Product.find(searchConditions)
          .populate("brand", "name slug")
          .populate("category", "name slug")
          .sort(sortConditions)
          .skip(skip)
          .limit(limit)
          .lean();
      } catch (err) {
        console.error("Error building product search query:", err.message);
        return {
          products: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          },
          filters,
        };
      }
      let products = [];
      try {
        products = await Promise.race([queryPromise, timeoutPromise]);
      } catch (error) {
        console.error(
          "Search products query timed out or failed:",
          error.message
        );
        return {
          products: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          },
          filters,
        };
      }
      // Đếm tổng số kết quả
      let totalCount;
      try {
        totalCount = products.length * 2;
        if (products.length === limit) {
          const countPromise = Product.countDocuments(searchConditions);
          totalCount = await Promise.race([countPromise, timeoutPromise]);
        }
      } catch (error) {
        console.error(
          "Count documents query timed out or failed:",
          error.message
        );
        totalCount = products.length * 2;
      }
      return {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
        filters: {
          query,
          category,
          brand,
          minPrice,
          maxPrice,
          sortBy,
        },
      };
    } catch (error) {
      console.error("Error searching products:", error.message);
      return {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNext: false,
          hasPrev: false,
        },
        filters,
      };
    }
  } // Lấy danh sách filter options
  static async getFilterOptions() {
    try {
      // Giới hạn thời gian thực thi truy vấn
      const timeout = 3000; // 3 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), timeout)
      );

      // Đơn giản hóa truy vấn để tăng hiệu suất - KHÔNG sử dụng limit() với distinct()
      // Sử dụng find() với giới hạn thay vì distinct() để có thể kiểm soát số lượng kết quả
      const brandsPromise = Product.find({}, { brand: 1 }).limit(50).lean();
      const categoriesPromise = Product.find({}, { category: 1 })
        .limit(50)
        .lean();
      const priceRangePromise = Product.aggregate([
        { $match: { status: "active" } },
        { $limit: 50 }, // Giảm giới hạn xuống để tránh quá tải
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]);

      // Thực hiện các truy vấn với timeout
      let brandsResult, categoriesResult, priceRange;
      try {
        [brandsResult, categoriesResult, priceRange] = await Promise.race([
          Promise.all([brandsPromise, categoriesPromise, priceRangePromise]),
          timeoutPromise,
        ]);
      } catch (error) {
        console.error("Filter options query timed out:", error.message);
        return {
          brands: [],
          categories: [],
          priceRange: { minPrice: 0, maxPrice: 10000000 },
        };
      }

      // Lấy danh sách brand và category ID riêng biệt (loại bỏ trùng lặp)
      const uniqueBrandIds = [
        ...new Set(brandsResult.map((item) => item.brand).filter(Boolean)),
      ];
      const uniqueCategoryIds = [
        ...new Set(
          categoriesResult.map((item) => item.category).filter(Boolean)
        ),
      ];

      // Truy vấn thông tin đầy đủ cho brand và category với số lượng giới hạn
      let brands = [];
      let categories = [];

      try {
        // Truy vấn song song và có timeout
        const populateResults = await Promise.race([
          Promise.all([
            // Chỉ lấy thông tin các brand/category đã tìm thấy
            uniqueBrandIds.length
              ? Product.populate([{ _id: "temp", brand: uniqueBrandIds }], {
                  path: "brand",
                  select: "name slug",
                })
              : Promise.resolve([]),

            uniqueCategoryIds.length
              ? Product.populate(
                  [{ _id: "temp", category: uniqueCategoryIds }],
                  { path: "category", select: "name slug" }
                )
              : Promise.resolve([]),
          ]),
          timeoutPromise,
        ]);

        if (populateResults && populateResults.length === 2) {
          brands =
            populateResults[0].length && populateResults[0][0].brand
              ? populateResults[0][0].brand
              : [];
          categories =
            populateResults[1].length && populateResults[1][0].category
              ? populateResults[1][0].category
              : [];
        }
      } catch (error) {
        console.error("Population timed out:", error.message);
        // Trả về mảng rỗng nếu không thể populate
        brands = [];
        categories = [];
      }

      return {
        brands: brands,
        categories: categories,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
      };
    } catch (error) {
      throw new Error(`Error getting filter options: ${error.message}`);
    }
  }
  // Lấy từ khóa tìm kiếm phổ biến
  static async getPopularSearchTerms(limit = 10) {
    // Sử dụng danh sách cố định để tránh truy vấn database
    const popularTerms = [
      "iPhone",
      "Samsung",
      "Laptop",
      "Áo thun",
      "Giày sneaker",
      "Tai nghe",
      "Đồng hồ",
      "Túi xách",
      "Sữa rửa mặt",
      "Nước hoa",
    ];

    return popularTerms.slice(0, limit);
  }
}

export default SearchService;
