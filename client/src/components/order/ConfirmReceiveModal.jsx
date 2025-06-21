import React from "react";
import { FiPackage, FiX } from "react-icons/fi";

const ConfirmReceiveModal = ({ isOpen, onClose, onConfirm, orderDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiPackage className="text-green-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Xác nhận nhận hàng
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn đã nhận được đơn hàng này không?
          </p>

          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Đơn hàng #{orderDetails._id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-sm text-gray-600">
                Số sản phẩm: {orderDetails.orderItems?.length || 0} sản phẩm
              </p>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Sau khi xác nhận nhận hàng, bạn sẽ có thể
              đánh giá sản phẩm và không thể hủy đơn hàng này.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Đã nhận hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReceiveModal;
