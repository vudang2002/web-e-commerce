import { useQuery, useMutation, useQueryClient } from "react-query";
import { getBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import { getFeaturedProducts } from "../services/productService";
import { getProductById } from "../services/productService";
import {
  getVouchers,
  getVoucherById,
  getActiveVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../services/voucherService";
import orderService from "../services/orderService";
import { searchProducts } from "../services/searchService";

// ===== UTILITY FUNCTIONS =====
// Các utility functions giúp tái sử dụng logic xử lý response từ API

/**
 * Tiện ích để trích xuất mảng từ response API
 * Xử lý các định dạng phản hồi khác nhau từ backend
 * @param {*} response - Response từ API
 * @param {string} dataType - Loại dữ liệu (để log)
 * @returns {Array} - Mảng dữ liệu hoặc mảng rỗng
 */
const extractArrayFromResponse = (response, dataType = "data") => {
  // Xử lý các định dạng phản hồi khác nhau
  if (response?.success && Array.isArray(response?.data)) {
    return response.data;
  } else if (Array.isArray(response)) {
    return response;
  } else if (response && typeof response === "object") {
    // Tìm mảng trong object
    const possibleArray = Object.values(response).find((val) =>
      Array.isArray(val)
    );
    if (possibleArray) {
      return possibleArray;
    }
  }

  // Trường hợp không tìm thấy dữ liệu
  console.warn(`Không thể tìm thấy mảng ${dataType} trong response:`, response);
  return [];
};

/**
 * Tiện ích để trích xuất products từ response với cấu trúc đặc biệt
 * @param {*} response - Response từ API
 * @param {string} dataType - Loại dữ liệu (để log)
 * @returns {Array} - Mảng products hoặc mảng rỗng
 */
const extractProductsFromResponse = (response, dataType = "products") => {
  // Xử lý phản hồi từ API products
  if (response?.success && response?.data?.products) {
    return response.data.products;
  } else if (response?.success && Array.isArray(response.data)) {
    return response.data;
  } else if (Array.isArray(response)) {
    return response;
  } else {
    console.warn(
      `Cấu trúc phản hồi API ${dataType} không như mong đợi:`,
      response
    );
    return [];
  }
};

/**
 * Tiện ích để trích xuất object từ response API
 * @param {*} response - Response từ API
 * @returns {Object|null} - Object dữ liệu hoặc null
 */
const extractObjectFromResponse = (response) => {
  // Xử lý phản hồi từ API
  if (response?.success && response?.data) {
    return response.data;
  } else if (
    response &&
    typeof response === "object" &&
    !Array.isArray(response)
  ) {
    // Nếu API trả về object trực tiếp
    return response;
  }
  return null;
};

/**
 * Tiện ích để trích xuất products và pagination từ response
 * @param {*} response - Response từ API
 * @returns {Object} - Object với products và pagination
 */
const extractProductsWithPagination = (response) => {
  if (response?.success && response?.data) {
    return {
      products: response.data.products || [],
      pagination: response.data.pagination || {},
    };
  }
  return { products: [], pagination: {} };
};

// ===== HOOKS =====

// Hook để fetch danh sách brands
export const useBrands = () => {
  return useQuery(
    "brands",
    async () => {
      console.log("Đang fetch danh sách brands...");
      const response = await getBrands();
      return extractArrayFromResponse(response, "brands");
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách brands:", error);
      },
    }
  );
};

// Hook để fetch danh sách categories
export const useCategories = () => {
  return useQuery(
    "categories",
    async () => {
      console.log("Đang fetch danh sách categories...");
      const response = await getCategories();
      return extractArrayFromResponse(response, "categories");
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách categories:", error);
      },
    }
  );
};

// Hook để fetch danh sách sản phẩm gần đây
export const useRecentProducts = (limit = 35) => {
  return useQuery(
    ["recentProducts", limit],
    async () => {
      console.log(`Đang fetch ${limit} sản phẩm gần đây...`);
      const response = await getProducts(
        `?limit=${limit}&sortBy=createdAt&sortOrder=desc`
      );
      return extractProductsFromResponse(response, "sản phẩm gần đây");
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 phút
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm gần đây:", error);
      },
    }
  );
};

// Hook để fetch danh sách sản phẩm nổi bật
export const useFeaturedProducts = () => {
  return useQuery(
    "featuredProducts",
    async () => {
      console.log("Đang fetch sản phẩm nổi bật...");
      const response = await getFeaturedProducts();
      console.log("Phản hồi API sản phẩm nổi bật:", response);

      const products = extractArrayFromResponse(response, "sản phẩm nổi bật");
      console.log(`Tìm thấy ${products.length} sản phẩm nổi bật`);
      return products;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 phút
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm nổi bật:", error);
      },
    }
  );
};

// Hook để fetch brands theo category ID
export const useBrandsByCategory = (categoryId) => {
  return useQuery(
    ["brandsByCategory", categoryId],
    async () => {
      if (!categoryId) return [];

      console.log(`Đang fetch brands theo category ID: ${categoryId}...`);
      const response = await getBrands(`?categoryId=${categoryId}`);
      return extractArrayFromResponse(response, "brands");
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!categoryId, // Chỉ chạy query khi có categoryId
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách brands theo category:", error);
      },
    }
  );
};

// Hook để fetch chi tiết sản phẩm theo id
export const useProductDetail = (id) => {
  return useQuery(
    ["productDetail", id],
    async () => {
      if (!id) return null;
      const response = await getProductById(id);
      return extractObjectFromResponse(response);
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      },
    }
  );
};

// Hook để fetch danh sách vouchers
export const useVouchers = () => {
  return useQuery(
    "vouchers",
    async () => {
      console.log("Đang fetch danh sách vouchers...");
      const response = await getVouchers();
      return extractArrayFromResponse(response, "vouchers");
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách vouchers:", error);
      },
    }
  );
};

// Hook để fetch chi tiết voucher theo id
export const useVoucherDetail = (id) => {
  return useQuery(
    ["voucherDetail", id],
    async () => {
      if (!id) return null;
      const response = await getVoucherById(id);
      return extractObjectFromResponse(response);
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Lỗi khi lấy chi tiết voucher:", error);
      },
    }
  );
};

// Hook để fetch danh sách vouchers đang hoạt động cho khách hàng
export const useActiveVouchers = () => {
  return useQuery(
    "activeVouchers",
    async () => {
      console.log("Đang fetch danh sách vouchers hoạt động...");
      const response = await getActiveVouchers();
      return extractArrayFromResponse(response, "active vouchers");
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 phút
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách vouchers hoạt động:", error);
      },
    }
  );
};

// Hook để fetch danh sách orders cho admin
export const useOrders = () => {
  return useQuery(
    "orders",
    async () => {
      console.log("Đang fetch danh sách orders...");
      const response = await orderService.getAllOrders();
      return extractArrayFromResponse(response, "orders");
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách orders:", error);
      },
    }
  );
};

// ===== VOUCHER MUTATION HOOKS =====

// Hook để tạo voucher mới
export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation(createVoucher, {
    onSuccess: () => {
      // Invalidate và refetch vouchers list khi tạo thành công
      queryClient.invalidateQueries("vouchers");
      queryClient.invalidateQueries("activeVouchers");
    },
    onError: (error) => {
      console.error("Lỗi khi tạo voucher:", error);
    },
  });
};

// Hook để cập nhật voucher
export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation(({ id, data }) => updateVoucher(id, data), {
    onSuccess: (data, variables) => {
      // Invalidate vouchers list
      queryClient.invalidateQueries("vouchers");
      queryClient.invalidateQueries("activeVouchers");
      // Cập nhật cache cho voucher detail
      queryClient.invalidateQueries(["voucherDetail", variables.id]);
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật voucher:", error);
    },
  });
};

// Hook để xóa voucher
export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteVoucher, {
    onSuccess: () => {
      // Invalidate và refetch vouchers list khi xóa thành công
      queryClient.invalidateQueries("vouchers");
      queryClient.invalidateQueries("activeVouchers");
    },
    onError: (error) => {
      console.error("Lỗi khi xóa voucher:", error);
    },
  });
};

// Hook để fetch chi tiết category theo slug
export const useCategory = (slug) => {
  return useQuery(
    ["category", slug],
    async () => {
      if (!slug) return null;
      const { getCategoryBySlug } = await import("../services/categoryService");
      const response = await getCategoryBySlug(slug);
      return extractObjectFromResponse(response);
    },
    {
      enabled: !!slug,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Lỗi khi lấy chi tiết category:", error);
      },
    }
  );
};

// Hook để fetch sản phẩm theo category
export const useProductsByCategory = (categoryId, filters = {}) => {
  const {
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    minPrice,
    maxPrice,
  } = filters;

  return useQuery(
    ["productsByCategory", categoryId, filters],
    async () => {
      if (!categoryId) return { products: [], pagination: {} };

      console.log(`Đang fetch sản phẩm theo category ID: ${categoryId}...`);

      const searchFilters = {
        category: categoryId,
        page,
        limit: 25, // 5 sản phẩm x 5 dòng = 25 sản phẩm mỗi trang
      };

      // Map sorting to backend expected format
      if (sortBy === "price") {
        searchFilters.sortBy = sortOrder === "asc" ? "price_asc" : "price_desc";
      } else if (sortBy === "createdAt") {
        searchFilters.sortBy = sortOrder === "asc" ? "createdAt" : "newest";
      } else if (sortBy === "name") {
        searchFilters.sortBy = sortOrder === "asc" ? "name_asc" : "name_desc";
      } else if (sortBy === "sold") {
        searchFilters.sortBy = "sales";
      } else if (sortBy === "rating") {
        searchFilters.sortBy = "rating";
      } else {
        searchFilters.sortBy = "newest"; // default
      }

      // Add price filters if they exist
      if (minPrice) searchFilters.minPrice = minPrice;
      if (maxPrice) searchFilters.maxPrice = maxPrice;

      console.log("Loading products with filters:", searchFilters);

      const response = await searchProducts(searchFilters);
      console.log("Products response:", response);

      return extractProductsWithPagination(response);
    },
    {
      enabled: !!categoryId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 phút
      onError: (error) => {
        console.error("Lỗi khi lấy sản phẩm theo category:", error);
      },
    }
  );
};
