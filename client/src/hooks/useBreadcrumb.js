import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useProductDetail, useCategories, useBrands } from "./useProductData";

export const useBreadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Get product details if on product page
  const productId = params.id;
  const { data: product } = useProductDetail(productId);

  const breadcrumbItems = useMemo(() => {
    const path = location.pathname;
    const items = [];

    // Product detail page
    if (path.startsWith("/product/") && product) {
      // Find category and brand names
      const category = categories?.find(
        (c) => c._id === (product.category?._id || product.category)
      );
      const brand = brands?.find(
        (b) => b._id === (product.brand?._id || product.brand)
      );

      if (category) {
        items.push({
          label: category.name,
          path: `/category/${category._id}`,
        });
      }

      if (brand) {
        items.push({
          label: brand.name,
          path: `/brand/${brand._id}`,
        });
      }

      items.push({
        label: product.name,
        path: `/product/${product._id}`,
      });
    }
    // Category page
    else if (path.startsWith("/category/")) {
      const categoryId = params.id;
      const category = categories?.find((c) => c._id === categoryId);

      if (category) {
        items.push({
          label: "Danh mục",
          path: "/categories",
        });
        items.push({
          label: category.name,
          path: `/category/${category._id}`,
        });
      }
    }
    // Cart page
    else if (path === "/cart") {
      items.push({
        label: "Giỏ hàng",
        path: "/cart",
      });
    }
    // Orders page
    else if (path === "/orders") {
      items.push({
        label: "Đơn hàng của tôi",
        path: "/orders",
      });
    }
    // Order detail page
    else if (path.startsWith("/orders/")) {
      const orderId = params.id;
      items.push({
        label: "Đơn hàng của tôi",
        path: "/orders",
      });
      items.push({
        label: `Đơn hàng #${orderId?.slice(-6)}`,
        path: `/orders/${orderId}`,
      });
    }
    // Checkout page
    else if (path === "/checkout") {
      items.push({
        label: "Thanh toán",
        path: "/checkout",
      });
    }
    // Hot deals page
    else if (path === "/hot-deals") {
      items.push({
        label: "Hàng giá hời",
        path: "/hot-deals",
      });
    }
    // Search results
    else if (path === "/search") {
      const searchQuery = new URLSearchParams(location.search).get("q");
      items.push({
        label: "Kết quả tìm kiếm",
        path: "/search",
      });
      if (searchQuery) {
        items.push({
          label: `"${searchQuery}"`,
          path: location.pathname + location.search,
        });
      }
    }
    // About page
    else if (path === "/about") {
      items.push({
        label: "Về chúng tôi",
        path: "/about",
      });
    }
    // Contact page
    else if (path === "/contact") {
      items.push({
        label: "Liên hệ",
        path: "/contact",
      });
    }
    // Admin pages
    else if (path.startsWith("/admin")) {
      items.push({
        label: "Quản trị",
        path: "/admin",
      });

      if (path.includes("/products")) {
        items.push({
          label: "Sản phẩm",
          path: "/admin/products",
        });

        if (path.includes("/create")) {
          items.push({
            label: "Thêm sản phẩm",
            path: "/admin/products/create",
          });
        } else if (path.includes("/update/")) {
          const productId = path.split("/").pop();
          items.push({
            label: "Cập nhật sản phẩm",
            path: `/admin/products/update/${productId}`,
          });
        }
      } else if (path.includes("/categories")) {
        items.push({
          label: "Danh mục",
          path: "/admin/categories",
        });
      } else if (path.includes("/brands")) {
        items.push({
          label: "Thương hiệu",
          path: "/admin/brands",
        });
      } else if (path.includes("/orders")) {
        items.push({
          label: "Đơn hàng",
          path: "/admin/orders",
        });
      }
    }

    return items;
  }, [location, product, categories, brands, params]);

  return breadcrumbItems;
};
