import React from "react";
import ProductPrice from "../common/ProductPrice";
import { calculateDiscountedPrice } from "../../utils/formatters";

const CartTable = ({
  cartItems,
  selectedItems,
  allSelected,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
              />
            </th>
            <th className="px-4 py-3 text-left">Sản phẩm</th>
            <th className="px-4 py-3 text-center">Đơn giá</th>
            <th className="px-4 py-3 text-center">Số lượng</th>
            <th className="px-4 py-3 text-center">Số tiền</th>
            <th className="px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cartItems.map((item) => {
            const product = item.product;
            const productImage =
              product.images?.[0] || "/images/placeholder.jpg";
            const discountedPrice = calculateDiscountedPrice(
              product.price || 0,
              product.discount || 0
            );
            const totalPrice = discountedPrice * item.quantity;

            return (
              <tr key={item._id} className="align-middle">
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => onSelectItem(item._id)}
                  />
                </td>
                <td className="px-4 py-4 flex items-center gap-3 min-w-[220px]">
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Phân loại: {product.category?.name || "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Thương hiệu: {product.brand?.name || "-"}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <ProductPrice
                    product={product}
                    size="sm"
                    showDiscount={true}
                  />
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="inline-flex items-center border rounded overflow-hidden">
                    <button
                      className="w-8 h-8 flex items-center justify-center border-r border-gray-200 bg-gray-50 hover:bg-gray-100"
                      onClick={() =>
                        onUpdateQuantity(product._id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center border-l border-gray-200 bg-gray-50 hover:bg-gray-100"
                      onClick={() =>
                        onUpdateQuantity(product._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-red-600 font-semibold">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    className="text-red-600 hover:underline text-xs mr-2"
                    onClick={() => onRemoveItem(product._id)}
                  >
                    Xóa
                  </button>
                  <button className="text-blue-600 hover:underline text-xs">
                    Tìm sản phẩm tương tự
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
