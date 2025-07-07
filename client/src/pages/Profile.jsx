import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  FiUser,
  FiLock,
  FiSave,
  FiEye,
  FiEyeOff,
  FiCamera,
} from "react-icons/fi";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    gender: user?.gender || "Nam",
    birthDate: {
      day: "",
      month: "",
      year: "",
    },
  });

  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 1MB");
        return;
      }

      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast.error("Chỉ chấp nhận file JPEG, JPG hoặc PNG");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Prepare form data for profile update
      const updateData = { ...profileForm };

      // If there's a new avatar file, include it
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        Object.keys(updateData).forEach((key) => {
          if (key === "birthDate") {
            formData.append(key, JSON.stringify(updateData[key]));
          } else {
            formData.append(key, updateData[key]);
          }
        });

        // Call the API to update profile with avatar
        await updateProfile(formData);
      } else {
        // Call the API to update profile without avatar
        await updateProfile(updateData);
      }

      toast.success("Cập nhật thông tin thành công!");
      setAvatarFile(null); // Clear the file after successful upload
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin"
      );
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      // Call the API to change password
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu"
      );
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
          <p className="mt-1 text-gray-600">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Username */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-sm text-gray-600">
                    Tên đăng nhập
                  </label>
                  <div className="col-span-9">
                    <input
                      type="text"
                      value={user?.name || ""}
                      className="w-full px-3 py-2 text-gray-500 bg-gray-50 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-sm text-gray-600">
                    Tên
                  </label>
                  <div className="col-span-9">
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Vũ Đăng"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-sm text-gray-600">
                    Email
                  </label>
                  <div className="col-span-9 flex items-center">
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="21*******@st.huflit.edu.vn"
                    />
                    <button
                      type="button"
                      className="ml-2 text-blue-600 text-sm hover:underline"
                    >
                      Thay Đổi
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-sm text-gray-600">
                    Số điện thoại
                  </label>
                  <div className="col-span-9 flex items-center">
                    <input
                      type="tel"
                      name="phoneNo"
                      value={profileForm.phoneNo}
                      onChange={handleProfileChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="**********28"
                    />
                    <button
                      type="button"
                      className="ml-2 text-blue-600 text-sm hover:underline"
                    >
                      Thay Đổi
                    </button>
                  </div>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-sm text-gray-600">
                    Giới tính
                  </label>
                  <div className="col-span-9 flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={profileForm.gender === "Nam"}
                        onChange={handleProfileChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Nam</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={profileForm.gender === "Nữ"}
                        onChange={handleProfileChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Nữ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Khác"
                        checked={profileForm.gender === "Khác"}
                        onChange={handleProfileChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Khác</span>
                    </label>
                  </div>
                </div>

                {/* Birth Date */}
                <div className="grid grid-cols-12 items-center gap-4">
                  <label className="col-span-3 text-sm text-gray-600">
                    Ngày sinh
                  </label>
                  <div className="col-span-9 grid grid-cols-3 gap-2">
                    <select
                      name="day"
                      value={profileForm.birthDate.day}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          birthDate: { ...prev.birthDate, day: e.target.value },
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Ngày</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="month"
                      value={profileForm.birthDate.month}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          birthDate: {
                            ...prev.birthDate,
                            month: e.target.value,
                          },
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tháng</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Tháng {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="year"
                      value={profileForm.birthDate.year}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          birthDate: {
                            ...prev.birthDate,
                            year: e.target.value,
                          },
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Năm</option>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto mb-4">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "T"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="mb-4">
                  <label
                    htmlFor="avatar-upload"
                    className="inline-block px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Chọn Ảnh
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* File Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Dung lượng file tối đa 1 MB</p>
                  <p>Định dạng: JPEG, PNG</p>
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <FiLock className="w-5 h-5 text-red-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Đổi mật khẩu
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Xác nhận mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                >
                  <FiLock className="w-4 h-4 mr-2" />
                  {isLoading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
