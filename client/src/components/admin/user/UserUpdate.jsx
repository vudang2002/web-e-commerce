import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getUserById, updateUser } from "../../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  // Định nghĩa schema validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Họ và tên là bắt buộc")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được vượt quá 50 ký tự"),
    email: Yup.string()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
    role: Yup.string().oneOf(
      ["user", "admin", "staff"],
      "Vai trò không hợp lệ"
    ),
    isSeller: Yup.boolean(),
    storeName: Yup.string().when("isSeller", {
      is: true,
      then: (schema) =>
        schema.required("Tên cửa hàng là bắt buộc khi đăng ký bán hàng"),
    }),
    storeDescription: Yup.string(),
  });

  // Khởi tạo form với React Hook Form và yup resolver
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      isSeller: false,
      storeName: "",
      storeDescription: "",
    },
  });

  // Theo dõi giá trị isSeller để hiển thị/ẩn các trường liên quan
  const isSeller = watch("isSeller");

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchLoading(true);
      try {
        const response = await getUserById(id);
        if (response?.success && response.data) {
          const userData = response.data;
          setOriginalData(userData);

          // Cập nhật form với dữ liệu người dùng
          reset({
            name: userData.name || "",
            email: userData.email || "",
            role: userData.role || "user",
            isSeller: userData.isSeller || false,
            storeName: userData.storeName || "",
            storeDescription: userData.storeDescription || "",
          });

          // Hiển thị avatar nếu có
          if (userData.avatar) {
            setImagePreviewUrl(userData.avatar);
          }
        } else {
          toast.error("Không tìm thấy thông tin người dùng");
          setTimeout(() => {
            navigate("/admin/users");
          }, 1500);
        }
      } catch (err) {
        toast.error(
          `Lỗi khi lấy thông tin người dùng: ${
            err.message || "Lỗi không xác định"
          }`
        );
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate, reset]);

  // Xử lý upload avatar
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
    if (
      imagePreviewUrl &&
      imagePreviewUrl.startsWith("blob:") // chỉ revoke object URL
    ) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(originalData?.avatar || null);
  };

  // Xử lý khi submit form
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Tạo FormData cho dữ liệu cập nhật
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("isSeller", data.isSeller);

      if (data.isSeller) {
        formData.append("storeName", data.storeName);
        formData.append("storeDescription", data.storeDescription || "");
      }

      // Chỉ đính kèm avatar nếu người dùng đã tải lên ảnh mới
      if (imageFile) {
        formData.append("avatar", imageFile);
      }

      const response = await updateUser(id, formData);

      if (response?.success) {
        toast.success("Cập nhật người dùng thành công!");
        setTimeout(() => {
          navigate(`/admin/users/${id}`);
        }, 1500);
      } else {
        toast.error(
          `Cập nhật người dùng thất bại: ${
            response?.message || "Lỗi không xác định"
          }`
        );
      }
    } catch (err) {
      toast.error(`Lỗi: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Cập Nhật Thông Tin Người Dùng
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - User Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700">
                Thông tin cơ bản
              </h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Nhập họ và tên"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  {...register("role")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Seller Information */}
              <div className="pt-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isSeller"
                    {...register("isSeller")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isSeller"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Đăng ký bán hàng
                  </label>
                </div>

                {isSeller && (
                  <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                    {/* Store Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên cửa hàng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("storeName")}
                        className={`w-full px-3 py-2 border ${
                          errors.storeName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        placeholder="Nhập tên cửa hàng"
                      />
                      {errors.storeName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.storeName.message}
                        </p>
                      )}
                    </div>

                    {/* Store Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả cửa hàng
                      </label>
                      <textarea
                        {...register("storeDescription")}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Mô tả ngắn về cửa hàng của bạn"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Avatar Upload */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Ảnh đại diện
            </h2>

            {/* Avatar Preview */}
            {imagePreviewUrl ? (
              <div className="relative mb-4">
                <img
                  src={imagePreviewUrl}
                  alt="Avatar preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                >
                  <RiDeleteBin6Line className="text-red-500" size={20} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <FiUpload className="text-3xl text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 text-center">
                  Kéo và thả ảnh đại diện hoặc click để chọn
                </p>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  (Hỗ trợ ảnh: JPG, PNG, GIF; tối đa 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(`/admin/users/${id}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none inline-flex items-center"
          >
            {loading && (
              <AiOutlineLoading3Quarters className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            )}
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserUpdate;
