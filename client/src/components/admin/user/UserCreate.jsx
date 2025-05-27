import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCheckCircle } from "react-icons/md";
import { createUser } from "../../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";

const UserCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Định nghĩa schema validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Họ và tên là bắt buộc")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được vượt quá 50 ký tự"),
    email: Yup.string()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
    password: Yup.string()
      .required("Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
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
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      isSeller: false,
      storeName: "",
      storeDescription: "",
    },
  });

  // Theo dõi giá trị isSeller để hiển thị/ẩn các trường liên quan
  const isSeller = watch("isSeller");
  const selectedRole = watch("role");

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
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  };

  // Xử lý khi submit form
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Tạo FormData nếu có file ảnh
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      formData.append("isSeller", data.isSeller);

      if (data.isSeller) {
        formData.append("storeName", data.storeName);
        formData.append("storeDescription", data.storeDescription || "");
      }

      if (imageFile) {
        formData.append("avatar", imageFile);
      }

      const response = await createUser(formData);

      if (response?.success) {
        toast.success("Tạo người dùng thành công!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1500);
      } else {
        toast.error(
          `Tạo người dùng thất bại: ${
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

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Thêm Người Dùng Mới
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Tối thiểu 6 ký tự"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Role and Seller Settings */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-medium text-gray-700">
                Cài đặt tài khoản
              </h2>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò người dùng
                </label>
                <select
                  {...register("role")}
                  className={`w-full px-3 py-2 border ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                >
                  <option value="user">Người dùng thông thường</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="staff">Nhân viên</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Is Seller (Only show if not admin) */}
              {selectedRole !== "admin" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isSeller"
                    {...register("isSeller")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isSeller"
                    className="text-sm font-medium text-gray-700"
                  >
                    Đăng ký tài khoản bán hàng
                  </label>
                </div>
              )}

              {/* Seller Information (Only show if isSeller is true) */}
              {isSeller && selectedRole !== "admin" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-md font-medium text-gray-700">
                    Thông tin cửa hàng
                  </h3>

                  {/* Store Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên cửa hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("storeName")}
                      className={`w-full px-3 py-2 border ${
                        errors.storeName ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      placeholder="Nhập tên cửa hàng của bạn"
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
                      rows={4}
                      className={`w-full px-3 py-2 border ${
                        errors.storeDescription
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      placeholder="Mô tả ngắn về cửa hàng của bạn"
                    />
                    {errors.storeDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.storeDescription.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Avatar Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">Ảnh đại diện</h2>

            {imagePreviewUrl ? (
              <div className="relative border border-gray-200 rounded-lg p-4">
                <img
                  src={imagePreviewUrl}
                  alt="Avatar Preview"
                  className="max-w-full h-auto max-h-56 object-contain mx-auto rounded-full"
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
                  Kéo & thả ảnh đại diện vào đây, hoặc nhấn để chọn file
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
            onClick={() => navigate("/admin/users")}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white flex items-center ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Đang Xử Lý...
              </>
            ) : (
              <>
                <MdOutlineCheckCircle className="mr-2" /> Tạo Người Dùng
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;
