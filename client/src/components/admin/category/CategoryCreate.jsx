import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCheckCircle } from "react-icons/md";
import { createCategory } from "../../../services/categoryService";
import { uploadSingleImage } from "../../../services/uploadService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Tên danh mục là bắt buộc")
      .min(3, "Tên danh mục phải có ít nhất 3 ký tự")
      .max(50, "Tên danh mục không được vượt quá 50 ký tự"),
    description: Yup.string()
      .max(500, "Mô tả không được vượt quá 500 ký tự")
      .nullable(),
  });

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Handle image upload
  const onDrop = useCallback((acceptedFiles) => {
    // Update the files state
    setImageFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

    // Generate preview URLs for the images
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewUrls((prevUrls) => [...prevUrls, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  const removeImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null); // Upload images first if there are any
      let categoryImageUrl = "";
      if (imageFiles.length > 0) {
        const formData = new FormData();
        // Sử dụng tên field là "image" thay vì "images", vì API category chỉ chấp nhận 1 ảnh
        formData.append("image", imageFiles[0]);

        try {
          // Sử dụng uploadSingleImage thay vì uploadProductImages
          const uploadResult = await uploadSingleImage(formData);
          console.log("Upload result:", uploadResult);

          if (uploadResult?.success && uploadResult?.data?.url) {
            categoryImageUrl = uploadResult.data.url;
          } else if (uploadResult?.url) {
            categoryImageUrl = uploadResult.url;
          } else if (typeof uploadResult === "string") {
            categoryImageUrl = uploadResult;
          } else if (
            uploadResult?.success &&
            typeof uploadResult?.data === "string"
          ) {
            categoryImageUrl = uploadResult.data;
          } else {
            throw new Error("Không nhận được URL hình ảnh từ server");
          }
        } catch (uploadErr) {
          console.error("Lỗi upload:", uploadErr);
          throw new Error(
            `Lỗi tải lên hình ảnh: ${uploadErr.message || "Không xác định"}`
          );
        }
      } // Create the category with the image URL
      await createCategory({
        ...data,
        image: categoryImageUrl,
      });

      toast.success("Danh mục đã được tạo thành công!");
      setTimeout(() => {
        navigate("/admin/categories");
      }, 2000);
    } catch (err) {
      setError(err.message || "Có lỗi khi tạo danh mục");
      toast.error(`Lỗi: ${err.message || "Có lỗi khi tạo danh mục"}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Tạo Danh Mục Mới
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 m-6 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Category Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Name Field */}
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Tên danh mục"
                    placeholder="Nhập tên danh mục"
                    error={errors.name?.message}
                    required
                    {...field}
                  />
                )}
              />
            </div>

            {/* Description Field */}
            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextAreaField
                    label="Mô tả"
                    placeholder="Nhập mô tả cho danh mục"
                    rows={4}
                    error={errors.description?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          {/* Right Column - Category Image Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh danh mục
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto text-gray-400 h-12 w-12 mb-2" />
                {isDragActive ? (
                  <p className="text-blue-500">Thả tệp ở đây ...</p>
                ) : (
                  <p className="text-gray-500">
                    Kéo & thả hình ảnh hoặc nhấn để chọn hình
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, GIF được chấp nhận. Tối đa 1 hình ảnh.
                </p>
              </div>

              {/* Preview Images */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 space-y-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative border rounded-md overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <RiDeleteBin6Line className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>{" "}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Quay Lại
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white flex items-center justify-center transition-colors w-32`}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
            ) : (
              <MdOutlineCheckCircle className="mr-2" />
            )}
            {loading ? "Đang xử lý..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryCreate;
