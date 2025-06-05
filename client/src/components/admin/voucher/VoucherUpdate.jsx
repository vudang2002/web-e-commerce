import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useVoucherDetail,
  useUpdateVoucher,
} from "../../../hooks/useProductData";

const VoucherUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch voucher data
  const {
    data: voucherData,
    isLoading: isLoadingVoucher,
    error: voucherError,
  } = useVoucherDetail(id);
  const updateVoucherMutation = useUpdateVoucher(); // Form validation schema
  const validationSchema = Yup.object({
    code: Yup.string()
      .required("Mã voucher là bắt buộc")
      .min(3, "Mã voucher phải có ít nhất 3 ký tự")
      .max(20, "Mã voucher không được vượt quá 20 ký tự")
      .matches(/^[A-Z0-9]+$/, "Mã voucher chỉ được chứa chữ hoa và số"),
    description: Yup.string()
      .max(500, "Mô tả không được vượt quá 500 ký tự")
      .nullable(),
    discountType: Yup.string()
      .required("Loại giảm giá là bắt buộc")
      .oneOf(["percentage", "fixed"], "Loại giảm giá không hợp lệ"),
    discountValue: Yup.number()
      .required("Giá trị giảm giá là bắt buộc")
      .positive("Giá trị giảm giá phải lớn hơn 0")
      .when("discountType", {
        is: "percentage",
        then: (schema) =>
          schema.max(100, "Phần trăm giảm giá không được vượt quá 100%"),
      }),
    minOrderAmount: Yup.number()
      .nullable()
      .min(0, "Đơn hàng tối thiểu không được âm"),
    maxUses: Yup.number()
      .required("Số lượt sử dụng tối đa là bắt buộc")
      .positive("Số lượt sử dụng phải lớn hơn 0")
      .integer("Số lượt sử dụng phải là số nguyên"),
    endDate: Yup.date().required("Ngày kết thúc là bắt buộc"),
  });
  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxUses: "",
      endDate: "",
      isActive: true,
    },
  });

  const discountType = watch("discountType");
  // Load voucher data into form when available
  useEffect(() => {
    if (voucherData) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      reset({
        code: voucherData.code || "",
        description: voucherData.description || "",
        discountType: voucherData.discountType || "percentage",
        discountValue: voucherData.amount || "",
        minOrderAmount: voucherData.minOrderValue || "",
        maxUses: voucherData.usageLimit || "",
        endDate: formatDateForInput(voucherData.expireAt),
        isActive: voucherData.isActive ?? true,
      });
    }
  }, [voucherData, reset]);

  // Handle voucher error
  useEffect(() => {
    if (voucherError) {
      setError("Không thể tải thông tin voucher");
      toast.error("Không thể tải thông tin voucher");
    }
  }, [voucherError]);
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Prepare form data - map to server expected field names
      const voucherUpdateData = {
        code: data.code,
        description: data.description || "",
        discountType: data.discountType,
        amount: parseFloat(data.discountValue), // Server expects 'amount' not 'discountValue'
        minOrderValue: data.minOrderAmount
          ? parseFloat(data.minOrderAmount)
          : 0, // Server expects 'minOrderValue'
        usageLimit: parseInt(data.maxUses), // Server expects 'usageLimit' not 'maxUses'
        isActive: data.isActive,
        expireAt: data.endDate, // Server expects 'expireAt' not 'endDate'
      };

      console.log("Sending update data:", voucherUpdateData); // Debug log

      const response = await updateVoucherMutation.mutateAsync({
        id,
        data: voucherUpdateData,
      });

      if (response?.success) {
        toast.success("Cập nhật voucher thành công!");
        setTimeout(() => {
          navigate("/admin/vouchers");
        }, 1500);
      } else {
        setError(response?.message || "Có lỗi xảy ra khi cập nhật voucher");
        toast.error(response?.message || "Có lỗi xảy ra khi cập nhật voucher");
      }
    } catch (err) {
      const errorMessage = err.message || "Có lỗi xảy ra khi cập nhật voucher";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingVoucher) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">
          Đang tải thông tin voucher...
        </span>
      </div>
    );
  }

  if (voucherError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-10">
          <div className="text-red-500 text-lg font-medium mb-2">
            Không thể tải thông tin voucher
          </div>
          <div className="text-gray-500 mb-4">
            {voucherError.message || "Đã xảy ra lỗi khi tải dữ liệu"}
          </div>
          <button
            onClick={() => navigate("/admin/vouchers")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Cập Nhật Voucher
        </h1>
        <p className="text-gray-500 mt-1">Chỉnh sửa thông tin voucher</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mã Voucher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã Voucher *
            </label>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="VD: SUMMER2024"
                />
              )}
            />{" "}
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>
        </div>
        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Mô tả chi tiết về voucher..."
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loại giảm giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giảm giá *
            </label>
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.discountType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (VNĐ)</option>
                </select>
              )}
            />
            {errors.discountType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountType.message}
              </p>
            )}
          </div>

          {/* Giá trị giảm giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị giảm giá *
            </label>
            <Controller
              name="discountValue"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  step={discountType === "percentage" ? "1" : "1000"}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.discountValue ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={discountType === "percentage" ? "10" : "50000"}
                />
              )}
            />
            {errors.discountValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountValue.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Đơn hàng tối thiểu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn hàng tối thiểu (VNĐ)
            </label>
            <Controller
              name="minOrderAmount"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  step="1000"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.minOrderAmount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0 (không giới hạn)"
                />
              )}
            />
            {errors.minOrderAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minOrderAmount.message}
              </p>
            )}
          </div>

          {/* Số lượt sử dụng tối đa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượt sử dụng tối đa *
            </label>
            <Controller
              name="maxUses"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  step="1"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.maxUses ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="100"
                />
              )}
            />
            {errors.maxUses && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxUses.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ngày bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu *
            </label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* Ngày kết thúc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc *
            </label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>
        {/* Trạng thái */}
        <div>
          <label className="flex items-center">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  checked={field.value}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              )}
            />
            <span className="text-sm font-medium text-gray-700">
              Kích hoạt voucher
            </span>
          </label>
        </div>
        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/vouchers")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật Voucher"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default VoucherUpdate;
