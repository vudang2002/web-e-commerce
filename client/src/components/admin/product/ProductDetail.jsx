import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  deleteProduct,
} from "../../../services/productService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";
import SelectField from "../../common/SelectField";
import AttributesDisplay from "../../common/AttributesDisplay";
import ImageGallery from "../../common/ImageGallery";
import ConfirmModal from "../../common/ConfirmModal";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((res) => {
        if (res?.success && res.data) {
          setProduct(res.data);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi lấy chi tiết sản phẩm");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const confirmDelete = () => {
    deleteProduct(id)
      .then((res) => {
        if (res?.success) {
          toast.success("Xóa sản phẩm thành công!");
          navigate("/admin/products");
        } else {
          toast.error("Xóa sản phẩm thất bại");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Lỗi khi xóa sản phẩm");
      })
      .finally(() => setIsModalOpen(false));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
        <span>Đang tải chi tiết sản phẩm...</span>
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-600 p-4 m-6 rounded">{error}</div>
    );
  if (!product) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Chi Tiết Sản Phẩm
        </h1>
      </div>
      <form className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Product Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Product Name */}
            <InputField
              label="Tên Sản Phẩm"
              value={product.name || ""}
              readOnly
            />
            {/* Description */}
            <TextAreaField
              label="Mô Tả Sản Phẩm"
              value={product.description || ""}
              readOnly
            />
            {/* Category */}
            <SelectField
              label="Danh Mục Sản Phẩm"
              value={product.category?.name || product.category || ""}
              disabled
            />
            {/* Brand */}
            <SelectField
              label="Nhãn Hàng"
              value={product.brand?.name || product.brand || ""}
              disabled
            />
            {/* Stock and Attributes in one row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Attributes */}
              <div className="space-y-2">
                <AttributesDisplay
                  attributes={product.attributes || []}
                  className="mt-2"
                />
              </div>
              {/* Stock */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tồn Kho
                </label>
                <InputField
                  type="number"
                  className="w-full px-3 py-2  focus:outline-none"
                  value={product.stock}
                  readOnly
                />
              </div>
            </div>{" "}
            {/* Status, Price and Featured in one row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng Thái
                </label>
                <SelectField
                  className="w-full px-3 py-2  focus:outline-none"
                  value={product.status}
                  disabled
                >
                  <option value={product.status}>{product.status}</option>
                </SelectField>
              </div>
              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giá Sản Phẩm
                </label>
                <InputField
                  type="number"
                  className="w-full px-3 py-2 focus:outline-none"
                  value={product.price}
                  readOnly
                />
              </div>
              {/* Featured Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sản Phẩm Nổi Bật
                </label>
                <div className="flex items-center h-10">
                  <div
                    className={`flex items-center justify-center px-4 py-2 rounded-md ${
                      product.isFeatured
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <FaStar
                      className={`mr-2 ${
                        product.isFeatured ? "text-white" : "text-gray-500"
                      }`}
                    />
                    {product.isFeatured ? "Đã Ghim" : "Chưa Ghim"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Product Gallery */}
          <div className="space-y-6">
            <div>
              <ImageGallery
                images={product.images || []}
                className="mt-4 space-y-2"
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            onClick={() => navigate("/admin/products")}
          >
            Quay Lại
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition uppercase"
              onClick={() => navigate(`/admin/products/update/${product._id}`)}
            >
              Update Sản Phẩm
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition uppercase"
              onClick={() => setIsModalOpen(true)}
            >
              Delete Sản Phẩm
            </button>
          </div>
        </div>
      </form>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
