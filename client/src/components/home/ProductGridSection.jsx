import ProductCard from "./ProductCard";
import { useRecentProducts } from "../../hooks/useProductData";
import { toast } from "react-toastify";

const ProductGridSection = () => {
  // Sử dụng React Query hook để lấy 36 sản phẩm gần đây
  const { data: products = [], isLoading, error } = useRecentProducts(36);

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    console.error("Error fetching recent products:", error);
    toast.error("Không thể tải sản phẩm gợi ý");
  }
  return (
    <section className="w-full sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[66%] mx-auto my-8">
      <h2 className="text-center text-lg font-bold uppercase border-b pb-2 mb-4 text-red-600">
        Gợi Ý Hôm Nay
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              image={product.images[0] || "/images/products/manhinh.png"}
              title={product.name}
              price={product.price}
              sold={product.sold}
              discount={product.discount} // Không có trường discount trong dữ liệu trả về
              badge={product.isFeatured ? "Nổi bật" : null}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGridSection;
