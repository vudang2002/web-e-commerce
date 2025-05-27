// filepath: e:\Javascript\web-e-commerce\client\src\components\admin\brand\BrandCreate.jsx
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCheckCircle } from "react-icons/md";
import { createBrand } from "../../../services/brandService";
import { getCategories } from "../../../services/categoryService";
import { uploadBrandImage } from "../../../services/uploadService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";
import Select from "react-select";

const BrandCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Tên nhãn hàng là bắt buộc")
      .min(2, "Tên nhãn hàng phải có ít nhất 2 ký tự")
      .max(50, "Tên nhãn hàng không được vượt quá 50 ký tự"),
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

  // Fetch categories for the multi-select
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response?.success) {
          const categoryOptions = response.data.map((category) => ({
            value: category._id,
            label: category.name,
          }));
          setCategories(categoryOptions);
        } else {
          throw new Error(response?.message || "Không thể tải danh mục");
        }
      } catch (err) {
        setError(err.message || "Có lỗi khi tải danh mục");
        toast.error(`Lỗi: ${err.message || "Có lỗi khi tải danh mục"}`);
        console.error("Lỗi tải danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  // Handle logo upload
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      // Generate preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  const removeImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl); // Clean up object URL
    }
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Upload logo image first if there is one
      let logoUrl = "";
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("logo", imageFile);

          console.log("Đang tải lên logo nhãn hàng...");
          const uploadResponse = await uploadBrandImage(formData);
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
            throw new Error("Không nhận được URL logo từ server");
          }
          console.log("URL logo:", logoUrl);
        } catch (uploadError) {
          console.error("Lỗi tải lên:", uploadError);
          throw new Error(
            `Lỗi tải lên logo: ${uploadError.message || "Không xác định"}`
          );
        }
      }

      // Create the brand with the logo URL
      const brandData = {
        ...data,
        logo: logoUrl,
        categories: selectedCategories.map((cat) => cat.value),
      };

      console.log("Dữ liệu nhãn hàng gửi đi:", brandData);
      const response = await createBrand(brandData);
      console.log("Kết quả tạo nhãn hàng:", response);

      if (response?.success) {
        // Clean up preview URL
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
        toast.success("Tạo nhãn hàng thành công!");
        setTimeout(() => {
          navigate("/admin/brands");
        }, 1200);
      } else {
        throw new Error(response?.message || "Không thể tạo nhãn hàng");
      }
    } catch (err) {
      setError(err.message || "Có lỗi khi tạo nhãn hàng");
      toast.error(`Lỗi: ${err.message || "Có lỗi khi tạo nhãn hàng"}`);
      console.error("Lỗi tạo nhãn hàng:", err);
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
          Tạo Nhãn Hàng Mới
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 m-6 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Brand Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Brand Name */}
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Tên Nhãn Hàng"
                    placeholder="Nhập tên nhãn hàng"
                    error={errors.name?.message}
                    required
                    {...field}
                  />
                )}
              />
            </div>

            {/* Description */}
            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextAreaField
                    label="Mô tả"
                    placeholder="Nhập mô tả cho nhãn hàng"
                    rows={4}
                    error={errors.description?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Categories - Multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh Mục
              </label>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={categories}
                    classNamePrefix="select"
                    placeholder="Chọn danh mục"
                    onChange={(selected) => {
                      setSelectedCategories(selected);
                      field.onChange(selected);
                    }}
                    className={`${
                      errors.categories ? "border-red-500" : "border-gray-300"
                    }`}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: errors.categories
                          ? "#f56565"
                          : state.isFocused
                          ? "#3182ce"
                          : "#e2e8f0",
                        boxShadow: state.isFocused
                          ? "0 0 0 1px #3182ce"
                          : "none",
                        "&:hover": {
                          borderColor: state.isFocused ? "#3182ce" : "#cbd5e0",
                        },
                      }),
                      option: (baseStyles, { isSelected, isFocused }) => ({
                        ...baseStyles,
                        backgroundColor: isSelected
                          ? "#3182ce"
                          : isFocused
                          ? "#edf2f7"
                          : "white",
                        color: isSelected ? "white" : "#2d3748",
                        cursor: "pointer",
                        ":active": {
                          backgroundColor: isSelected ? "#3182ce" : "#e2e8f0",
                        },
                      }),
                      multiValue: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: "#ebf4ff",
                        borderRadius: "0.25rem",
                      }),
                      multiValueLabel: (baseStyles) => ({
                        ...baseStyles,
                        color: "#3182ce",
                        fontWeight: 500,
                        padding: "2px 6px",
                      }),
                      multiValueRemove: (baseStyles) => ({
                        ...baseStyles,
                        color: "#3182ce",
                        ":hover": {
                          backgroundColor: "#3182ce",
                          color: "white",
                        },
                      }),
                    }}
                  />
                )}
              />
              {errors.categories && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.categories.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Brand Logo Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Nhãn Hàng
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
                    Kéo & thả logo hoặc nhấn để chọn hình
                  </p>
                )}{" "}
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, GIF, SVG, WebP được chấp nhận. Tối đa 5MB.
                </p>
              </div>

              {/* Logo Preview */}
              {imagePreviewUrl && (
                <div className="mt-4 space-y-2">
                  <div className="relative border rounded-md overflow-hidden p-2">
                    <img
                      src={imagePreviewUrl}
                      alt="Logo Preview"
                      className="h-32 w-auto mx-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <RiDeleteBin6Line className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/brands")}
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

export default BrandCreate;
