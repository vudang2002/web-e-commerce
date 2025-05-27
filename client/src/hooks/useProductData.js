import { useQuery } from "react-query";
import { getBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import { getFeaturedProducts } from "../services/productService";
import { getProductById } from "../services/productService";
// Hook để fetch danh sách brands
export const useBrands = () => {
  return useQuery(
    "brands",
    async () => {
      console.log("Đang fetch danh sách brands...");
      const response = await getBrands();

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
      console.warn("Không thể tìm thấy mảng brands trong response:", response);
      return [];
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
      console.warn(
        "Không thể tìm thấy mảng categories trong response:",
        response
      );
      return [];
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

      // Xử lý phản hồi từ API
      if (response?.success && response?.data?.products) {
        return response.data.products;
      } else {
        console.warn("Cấu trúc phản hồi API không như mong đợi:", response);
        return [];
      }
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

      // Xử lý phản hồi từ API
      if (response?.success && Array.isArray(response.data)) {
        console.log(`Tìm thấy ${response.data.length} sản phẩm nổi bật`);
        return response.data;
      } else {
        console.warn("Cấu trúc phản hồi API không như mong đợi:", response);
        return [];
      }
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

      // Xử lý các định dạng phản hồi khác nhau
      if (response?.success && Array.isArray(response?.data)) {
        console.log(`Tìm thấy ${response.data.length} brands thuộc danh mục`);
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
      console.warn("Không thể tìm thấy mảng brands trong response:", response);
      return [];
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
      // Xử lý phản hồi từ API
      if (response?.success && response?.data) {
        return response.data;
      } else if (response && typeof response === "object") {
        // Nếu API trả về object sản phẩm trực tiếp
        return response;
      }
      return null;
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
