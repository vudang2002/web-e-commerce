import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBrandById, updateBrand } from "../../../services/brandService";
import { uploadBrandImage } from "../../../services/uploadService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCheckCircle } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";

const BrandUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Fetch brand details
  useEffect(() => {
    const fetchBrandDetails = async () => {
      setLoading(true);
      try {
        const response = await getBrandById(id);
        if (response?.success && response.data) {
          setBrand(response.data);
          setFormData({
            name: response.data.name || "",
            description: response.data.description || "",
          });
          if (response.data.logo) {
            setImagePreviewUrl(response.data.logo);
          }
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

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = () => {
    setImageFile(null);
    if (imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(brand?.logo || "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Tải logo lên nếu có thay đổi
      let logoUrl = brand?.logo || "";
      if (imageFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("image", imageFile);

          console.log("Đang tải lên logo thương hiệu...");
          const uploadResponse = await uploadBrandImage(uploadFormData);
          console.log("Kết quả tải lên:", uploadResponse);

          // Kiểm tra nhiều định dạng phản hồi có thể
          if (uploadResponse?.url) {
            logoUrl = uploadResponse.url;
          } else if (uploadResponse?.data?.url) {
            logoUrl = uploadResponse.data.url;
          } else if (typeof uploadResponse === "string") {
            logoUrl = uploadResponse;
          } else {
            console.error("Định dạng response không xác định:", uploadResponse);
            toast.error("Không nhận được URL logo từ server");
            setSubmitting(false);
            return;
          }
          console.log("URL logo mới:", logoUrl);
        } catch (uploadError) {
          console.error("Lỗi tải lên:", uploadError);
          toast.error(
            `Không thể tải lên logo: ${
              uploadError.message || "Lỗi không xác định"
            }`
          );
          setSubmitting(false);
          return;
        }
      }

      // Cập nhật thương hiệu với thông tin mới và URL logo mới nếu có
      const updateData = {
        ...formData,
        logo: logoUrl,
      };

      const response = await updateBrand(id, updateData);
      if (response?.success) {
        toast.success("Cập nhật thương hiệu thành công!");
        setTimeout(() => {
          navigate(`/admin/brands/detail/${id}`);
        }, 1500);
      } else {
        toast.error("Cập nhật thương hiệu thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi khi cập nhật thương hiệu");
    } finally {
      setSubmitting(false);
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

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Cập Nhật Thương Hiệu
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Brand Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Brand Name */}
            <InputField
              label="Tên Thương Hiệu"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {/* Description */}
            <TextAreaField
              label="Mô Tả Thương Hiệu"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {/* Right Column - Logo Upload */}
          <div className="space-y-4">
            <label className="font-medium text-gray-700 mb-1 block">
              Logo Thương Hiệu
            </label>
            {imagePreviewUrl ? (
              <div className="relative border border-gray-200 rounded-lg p-2">
                <img
                  src={imagePreviewUrl}
                  alt="Brand Logo Preview"
                  className="max-w-full h-auto max-h-48 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300"
                } rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors`}
              >
                <input {...getInputProps()} />
                <FiUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Kéo & thả logo vào đây, hoặc nhấn để chọn file
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF tối đa 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate(`/admin/brands/detail/${id}`)}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 rounded-md text-white flex items-center ${
              submitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Đang Lưu...
              </>
            ) : (
              <>
                <MdOutlineCheckCircle className="mr-2" /> Lưu Thay Đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandUpdate;
