import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  useProductDetail,
  useBrands,
  useCategories,
} from "../hooks/useProductData";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProductDetail(id);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const [selectedImg, setSelectedImg] = useState(0);

  // Lấy tên brand và category từ id
  const brandName =
    brands?.find((b) => b._id === (product?.brand?._id || product?.brand))
      ?.name || "";
  const categoryName =
    categories?.find(
      (c) => c._id === (product?.category?._id || product?.category)
    )?.name || "";

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Lỗi khi tải sản phẩm.</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow px-4 py-2 mt-2 w-full max-w-7xl mx-auto">
      {/* Hình ảnh sản phẩm */}
      <div className="flex flex-col items-center w-full max-w-[500px] mx-auto md:mx-0">
        {/* Ảnh lớn */}
        {product.images && product.images.length > 0 && (
          <img
            src={product.images[selectedImg]}
            alt={product.name}
            className="w-full h-[500px] object-contain rounded shadow my-4 bg-white mx-auto"
          />
        )}
        {/* Dãy ảnh nhỏ */}
        <div className="flex flex-row gap-[6px] justify-center mt-2">
          {product.images &&
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className={`md:w-24 md:h-24 object-cover rounded border-2 cursor-pointer transition-all duration-200 ${
                  selectedImg === idx ? "border-red-500" : "border-gray-200"
                }`}
                onClick={() => setSelectedImg(idx)}
              />
            ))}
        </div>
      </div>
      {/* Thông tin sản phẩm */}
      <div className="md:w-1/2 pl-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2 mt-2">{product.name}</h1>
          <div className="text-gray-500 text-sm mb-1">Brand: {brandName}</div>
          <div className="text-gray-500 text-sm mb-1">
            Category: {categoryName}
          </div>
          <div className="text-gray-500 text-sm mb-1">
            Availability: {product.countInStock || product.stock || 0} in Stock
          </div>

          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < (product.rating || 0)
                    ? "text-red-500 text-xl"
                    : "text-gray-300 text-xl"
                }
              >
                ★
              </span>
            ))}
          </div>
          {/* Voucher và thuộc tính nếu có */}
          {product.vouchers && (
            <div className="flex gap-2 mb-2">
              {product.vouchers.map((v, i) => (
                <span key={i} className="bg-gray-200 px-3 py-1 rounded text-sm">
                  {v}
                </span>
              ))}
            </div>
          )}
          {product.attributes && (
            <div className="flex gap-2 mb-4">
              {product.attributes.map((a, i) => (
                <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">
                  {a}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-end gap-4 mb-4">
            <span className="text-2xl font-bold text-red-600">
              ${product.price}
            </span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">
                ${product.oldPrice}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button className="bg-red-600 text-white px-8 py-2 rounded hover:bg-red-700">
            Buy Now
          </button>
          <button className="border border-red-600 text-red-600 px-8 py-2 rounded hover:bg-red-50">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
