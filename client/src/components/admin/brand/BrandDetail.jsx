import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBrandById, deleteBrand } from "../../../services/brandService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";
import ConfirmModal from "../../common/ConfirmModal";

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      setLoading(true);
      try {
        const response = await getBrandById(id);
        if (response?.success && response.data) {
          setBrand(response.data);
        } else {
          setError("Không tìm thấy thương hiệu");
        }
      } catch (err) {
        setError(err.message || "Lỗi khi lấy chi tiết thương hiệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandDetails();
  }, [id]);

  const confirmDelete = async () => {
    try {
      const response = await deleteBrand(id);
      if (response?.success) {
        toast.success("Xóa thương hiệu thành công!");
        setTimeout(() => {
          navigate("/admin/brands");
        }, 1500);
      } else {
        toast.error("Xóa thương hiệu thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi khi xóa thương hiệu");
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
        <span>Đang tải chi tiết thương hiệu...</span>
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-600 p-4 m-6 rounded">{error}</div>
    );
  if (!brand) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa thương hiệu "${brand?.name}" không?`}
      />

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Chi Tiết Thương Hiệu
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/brands/edit/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <FiEdit className="mr-1" /> Chỉnh sửa
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
          >
            <RiDeleteBin6Line className="mr-1" /> Xóa
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Brand Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Brand Name */}
          <InputField
            label="Tên Thương Hiệu"
            value={brand.name || ""}
            readOnly
          />
          {/* Description */}
          <TextAreaField
            label="Mô Tả Thương Hiệu"
            value={brand.description || ""}
            readOnly
          />
          {/* Slug */}
          <InputField
            label="Đường Dẫn (Slug)"
            value={brand.slug || ""}
            readOnly
          />
          {/* Created At */}
          <InputField
            label="Ngày Tạo"
            value={
              brand.createdAt
                ? new Date(brand.createdAt).toLocaleString("vi-VN")
                : ""
            }
            readOnly
          />
          {/* Updated At */}
          <InputField
            label="Cập Nhật Lần Cuối"
            value={
              brand.updatedAt
                ? new Date(brand.updatedAt).toLocaleString("vi-VN")
                : ""
            }
            readOnly
          />
        </div>

        {/* Right Column - Brand Logo */}
        <div className="space-y-4">
          <div className="font-medium text-gray-700 mb-1">Logo Thương Hiệu</div>
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-56 object-contain"
              />
            ) : (
              <div className="text-gray-400 text-center py-10">
                Không có logo
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
        <button
          onClick={() => navigate("/admin/brands")}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Quay Lại Danh Sách
        </button>
      </div>
    </div>
  );
};

export default BrandDetail;
