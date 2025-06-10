import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById, updateOrder } from "../../../services/orderService";
import { getAllProducts } from "../../../services/productService";
import { FiArrowLeft, FiPlus, FiMinus } from "react-icons/fi";

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    orderItems: [],
    shippingInfo: {
      address: "",
      phoneNo: "",
    },
    paymentMethod: "COD",
    orderStatus: "Processing",
    notes: "",
  });

  useEffect(() => {
    fetchOrder();
    fetchProducts();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(id);
      if (response?.success) {
        const order = response.data;
        setFormData({
          orderItems: order.orderItems || [],
          shippingInfo: order.shippingInfo || {
            address: "",
            phoneNo: "",
          },
          paymentMethod: order.paymentMethod || "COD",
          orderStatus: order.orderStatus || "Processing",
          notes: order.notes || "",
        });
      } else {
        toast.error("Không tìm thấy đơn hàng");
        navigate("/admin/orders");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin đơn hàng: " + error.message);
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await getAllProducts({ page: 1, limit: 1000 });
      if (response?.success) {
        // Server trả về: { success: true, data: { products, total, page, limit } }
        setProducts(response.data?.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Đảm bảo products luôn là array
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("shippingInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        shippingInfo: {
          ...prev.shippingInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOrderItemChange = (index, field, value) => {
    const updatedItems = [...formData.orderItems];
    updatedItems[index][field] = value; // Update price when product changes
    if (field === "product") {
      const selectedProduct = Array.isArray(products)
        ? products.find((p) => p._id === value)
        : null;
      if (selectedProduct) {
        updatedItems[index].price = selectedProduct.price;
      }
    }

    setFormData((prev) => ({ ...prev, orderItems: updatedItems }));
  };

  const addOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      orderItems: [...prev.orderItems, { product: "", quantity: 1, price: 0 }],
    }));
  };

  const removeOrderItem = (index) => {
    if (formData.orderItems.length > 1) {
      const updatedItems = formData.orderItems.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, orderItems: updatedItems }));
    }
  };

  const calculateTotal = () => {
    return formData.orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const orderData = {
        ...formData,
        totalPrice: calculateTotal(),
      };

      const response = await updateOrder(id, orderData);

      if (response?.success) {
        toast.success("Cập nhật đơn hàng thành công!");
        navigate(`/admin/orders/${id}`);
      } else {
        toast.error(response?.message || "Có lỗi xảy ra khi cập nhật đơn hàng");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật đơn hàng: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/admin/orders/${id}`)}
          className="mr-4 p-2 hover:bg-gray-100 rounded"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Chỉnh Sửa Đơn Hàng
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Sản Phẩm *
            </label>
            <button
              type="button"
              onClick={addOrderItem}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FiPlus className="mr-1" size={16} />
              Thêm sản phẩm
            </button>
          </div>

          {formData.orderItems.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4 p-4 border rounded-lg">
              <div className="flex-1">
                <select
                  value={item.product?._id || item.product}
                  onChange={(e) =>
                    handleOrderItemChange(index, "product", e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {" "}
                  <option value="">Chọn sản phẩm</option>
                  {Array.isArray(products) &&
                    products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} -{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </option>
                    ))}
                </select>
              </div>

              <div className="w-24">
                <input
                  type="number"
                  placeholder="Số lượng"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleOrderItemChange(
                      index,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-32">
                <input
                  type="number"
                  placeholder="Giá"
                  min="0"
                  value={item.price}
                  onChange={(e) =>
                    handleOrderItemChange(
                      index,
                      "price",
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.orderItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOrderItem(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <FiMinus size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Shipping Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Địa Chỉ Giao Hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ *
              </label>
              <input
                type="text"
                name="shippingInfo.address"
                value={formData.shippingInfo?.address || ""}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại *
              </label>
              <input
                type="text"
                name="shippingInfo.phoneNo"
                value={formData.shippingInfo?.phoneNo || ""}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        {/* Payment Method and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phương Thức Thanh Toán
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="COD">COD (Thanh toán khi nhận hàng)</option>
              <option value="Online">Online (Thanh toán trực tuyến)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng Thái Đơn Hàng
            </label>
            <select
              name="orderStatus"
              value={formData.orderStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Processing">Đang xử lý</option>
              <option value="Confirmed">Đã xác nhận</option>
              <option value="Shipping">Đang giao hàng</option>
              <option value="Delivered">Đã giao hàng</option>
              <option value="Cancelled">Đã hủy</option>
              <option value="Failed">Thất bại</option>
            </select>
          </div>
        </div>
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi Chú
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ghi chú cho đơn hàng..."
          />
        </div>
        {/* Total */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">
            Tổng tiền:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(calculateTotal())}
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/admin/orders/${id}`)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderEdit;
