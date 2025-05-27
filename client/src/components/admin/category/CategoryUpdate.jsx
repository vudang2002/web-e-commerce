import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategoryById,
  updateCategory,
} from "../../../services/categoryService";
import { uploadCategoryImage } from "../../../services/uploadService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";

const CategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCategoryById(id)
      .then((res) => {
        if (res?.success && res.data) {
          setCategory(res.data);
          setFormData({
            name: res.data.name || "",
            description: res.data.description || "",
            slug: res.data.slug || "",
            image: res.data.image || "",
          });
        } else {
          setError("Không tìm thấy danh mục");
        }
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi lấy chi tiết danh mục");
      })
      .finally(() => setLoading(false));
  }, [id]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Đã loại bỏ tự động cập nhật slug khi thay đổi tên để duy trì slug cho SEO
    // Giờ đây slug sẽ chỉ thay đổi khi người dùng trực tiếp chỉnh sửa trường slug
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tải ảnh lên nếu có
      let imageUrl = formData.image;
      if (imageFile) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append("image", imageFile);

          console.log("Đang tải lên ảnh danh mục...");
          const uploadResponse = await uploadCategoryImage(formDataUpload);
          console.log("Kết quả tải lên:", uploadResponse);

          // Kiểm tra nhiều định dạng phản hồi có thể
          if (uploadResponse?.url) {
            imageUrl = uploadResponse.url;
          } else if (uploadResponse?.data?.url) {
            imageUrl = uploadResponse.data.url;
          } else if (typeof uploadResponse === "string") {
            imageUrl = uploadResponse;
          } else {
            console.error("Định dạng response không xác định:", uploadResponse);
            toast.error("Không nhận được URL hình ảnh từ server");
            setLoading(false);
            return;
          }
          console.log("URL ảnh mới:", imageUrl);
        } catch (uploadError) {
          console.error("Lỗi tải lên:", uploadError);
          toast.error(
            `Không thể tải lên hình ảnh: ${
              uploadError.message || "Lỗi không xác định"
            }`
          );
          setLoading(false);
          return;
        }
      } // Cập nhật dữ liệu danh mục với URL hình ảnh mới nếu có
      const updatedData = {
        ...formData,
        image: imageUrl,
      };

      console.log("Dữ liệu cập nhật gửi đi:", updatedData);

      try {
        const response = await updateCategory(id, updatedData);
        console.log("Phản hồi từ API cập nhật:", response);

        if (response?.success) {
          toast.success("Cập nhật danh mục thành công!");
          setTimeout(() => navigate(`/admin/categories/${id}`), 1200);
        } else {
          toast.error(response?.message || "Cập nhật danh mục thất bại");
        }
      } catch (updateError) {
        console.error("Lỗi khi gọi API cập nhật:", updateError);
        toast.error(`Lỗi cập nhật: ${updateError.message || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Lỗi tổng thể:", error);
      toast.error(error?.message || "Lỗi khi cập nhật danh mục");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImageFile(file);
      setFormData({
        ...formData,
        imagePreview: URL.createObjectURL(file),
      });
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
  });

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
          Cập Nhật Danh Mục
        </h1>
      </div>
      <form className="p-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Category Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Category Name */}
            <InputField
              label="Tên Danh Mục"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên danh mục"
              required
            />{" "}
            {/* Slug - Giữ nguyên để tối ưu SEO */}
            <InputField
              label="Đường Dẫn (Slug)"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="duong-dan-danh-muc"
              required
              helperText="Lưu ý: Thay đổi slug có thể ảnh hưởng đến SEO. Chỉ thay đổi khi thật sự cần thiết."
            />
            {/* Description */}
            <TextAreaField
              label="Mô Tả Danh Mục"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả danh mục"
            />
          </div>
          {/* Right Column - Category Image */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình Ảnh
              </label>
              <div
                {...getRootProps({
                  className:
                    "flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer",
                })}
              >
                <input {...getInputProps()} />
                <p className="text-gray-500">
                  Kéo và thả ảnh vào đây hoặc nhấp để chọn ảnh
                </p>
              </div>
              <div className="mt-4 border border-gray-200 rounded-md p-2">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-auto object-cover rounded"
                  />
                ) : formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.name}
                    className="w-full h-auto object-cover rounded"
                  />
                ) : (
                  <div className="bg-gray-50 text-gray-500 text-center p-4">
                    Không có hình ảnh
                  </div>
                )}
              </div>
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
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition uppercase"
            disabled={loading}
          >
            {loading ? "Đang Lưu..." : "Lưu Thay Đổi"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CategoryUpdate;
