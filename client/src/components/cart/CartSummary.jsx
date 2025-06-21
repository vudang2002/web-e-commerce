import React from "react";

const CartSummary = ({
  cartItems,
  selectedItems,
  selectedTotalItems,
  selectedTotalPrice,
  allSelected,
  onSelectAll,
  onClearCart,
  onCheckout,
  clearCartLoading,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="mr-1"
          />
          <span className="text-gray-600 text-sm">
            Chọn Tất Cả ({cartItems.length})
          </span>
          <span className="text-gray-500 text-xs">
            - Đã chọn: {selectedItems.length}
          </span>
          <button
            onClick={onClearCart}
            disabled={clearCartLoading}
            className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50 ml-2"
          >
            {clearCartLoading ? "Đang xóa..." : "Xóa tất cả"}
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Shopee Voucher</span>
            <input
              type="text"
              className="border rounded px-2 py-1 text-sm"
              placeholder="Nhập mã giảm giá"
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              Áp dụng
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">
              Tổng cộng ({selectedTotalItems} sản phẩm):
            </span>
            <span className="text-lg font-bold text-red-600">
              {selectedTotalPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <button
            onClick={onCheckout}
            disabled={selectedItems.length === 0}
            className="bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Mua Hàng ({selectedItems.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
