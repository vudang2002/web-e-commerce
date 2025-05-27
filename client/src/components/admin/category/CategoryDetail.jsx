import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategoryById,
  deleteCategory,
} from "../../../services/categoryService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";
import ConfirmModal from "../../common/ConfirmModal";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategoryById(id)
      .then((res) => {
        if (res?.success && res.data) {
          setCategory(res.data);
        } else {
          setError("Không tìm thấy danh mục");
        }
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi lấy chi tiết danh mục");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const confirmDelete = () => {
    deleteCategory(id)
      .then((res) => {
        if (res?.success) {
          toast.success("Xóa danh mục thành công!");
          navigate("/admin/categories");
        } else {
          toast.error("Xóa danh mục thất bại");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Lỗi khi xóa danh mục");
      })
      .finally(() => setIsModalOpen(false));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
        <span>Đang tải chi tiết danh mục...</span>
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-600 p-4 m-6 rounded">{error}</div>
    );
  if (!category) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Chi Tiết Danh Mục
        </h1>
      </div>
      <form className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Category Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Category Name */}
            <InputField
              label="Tên Danh Mục"
              value={category.name || ""}
              readOnly
            />
            {/* Description */}
            <TextAreaField
              label="Mô Tả Danh Mục"
              value={category.description || ""}
              readOnly
            />
            {/* Slug */}
            <InputField
              label="Đường Dẫn (Slug)"
              value={category.slug || ""}
              readOnly
            />
            {/* Created At */}
            <InputField
              label="Ngày Tạo"
              value={
                category.createdAt
                  ? new Date(category.createdAt).toLocaleString()
                  : ""
              }
              readOnly
            />
            {/* Updated At */}
            <InputField
              label="Cập Nhật Lần Cuối"
              value={
                category.updatedAt
                  ? new Date(category.updatedAt).toLocaleString()
                  : ""
              }
              readOnly
            />
          </div>
          {/* Right Column - Category Image */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình Ảnh
              </label>
              {category.image ? (
                <div className="border border-gray-200 rounded-md p-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-auto object-cover rounded"
                  />
                </div>
              ) : (
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50 text-gray-500 text-center">
                  Không có hình ảnh
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            onClick={() => navigate(-1)}
          >
            Quay Lại
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition uppercase"
              onClick={() =>
                navigate(`/admin/categories/update/${category._id}`)
              }
            >
              Cập Nhật
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition uppercase"
              onClick={() => setIsModalOpen(true)}
            >
              Xóa Danh Mục
            </button>
          </div>
        </div>
      </form>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Xác nhận xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này không?"
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default CategoryDetail;
