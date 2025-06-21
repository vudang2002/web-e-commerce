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
import { createProduct } from "../../../services/productService";
import { uploadProductImages } from "../../../services/uploadService";
import { useBrands, useCategories } from "../../../hooks/useProductData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";
import SelectField from "../../common/SelectField";
import AttributesDisplay from "../../common/AttributesDisplay";
import ImageGallery from "../../common/ImageGallery";
import Select from "react-select";

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Sử dụng React Query hooks để fetch dữ liệu
  const {
    data: brands = [],
    isLoading: brandsLoading,
    error: brandsError,
  } = useBrands();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Xử lý lỗi từ React Query
  useEffect(() => {
    if (brandsError) {
      setError(`Lỗi khi tải thương hiệu: ${brandsError.message}`);
    } else if (categoriesError) {
      setError(`Lỗi khi tải danh mục: ${categoriesError.message}`);
    }
  }, [brandsError, categoriesError]);

  // Dynamic attributes state
  const [attributeKey, setAttributeKey] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Tên sản phẩm là bắt buộc")
      .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
      .max(100, "Tên sản phẩm không được vượt quá 100 ký tự"),
    description: Yup.string().max(1000, "Mô tả không được vượt quá 1000 ký tự"),
    price: Yup.number()
      .required("Giá sản phẩm là bắt buộc")
      .positive("Giá sản phẩm phải là số dương"),
    category: Yup.string().required("Danh mục là bắt buộc"),
    brand: Yup.string().required("Thương hiệu là bắt buộc"),
    stock: Yup.number()
      .required("Số lượng tồn kho là bắt buộc")
      .min(0, "Số lượng tồn kho không được âm")
      .integer("Số lượng tồn kho phải là số nguyên"),
    status: Yup.string().required("Trạng thái là bắt buộc"),
    discount: Yup.number()
      .min(0, "Giảm giá không được nhỏ hơn 0%")
      .max(100, "Giảm giá không được lớn hơn 100%"),
  });

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      stock: 0,
      status: "active",
      attributes: [],
      discount: 0,
    },
  });

  // Handle image upload
  const onDrop = useCallback((acceptedFiles) => {
    // Update the files state
    setImageFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

    // Generate preview URLs for the images
    acceptedFiles.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrls((prevUrls) => [...prevUrls, previewUrl]);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 10,
  });

  const removeImage = (index) => {
    // Clean up the preview URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);

    // Remove the image from both arrays
    setImageFiles((files) => files.filter((_, i) => i !== index));
    setImagePreviewUrls((urls) => urls.filter((_, i) => i !== index));
  };

  // Handle dynamic attributes
  const addAttribute = () => {
    if (attributeKey.trim() && attributeValue.trim()) {
      // Get current attributes
      const currentAttributes = getValues("attributes") || [];

      // Check if the attribute key already exists
      const existingAttrIndex = currentAttributes.findIndex(
        (attr) => attr.key === attributeKey
      );

      if (existingAttrIndex >= 0) {
        // Update existing attribute by adding new value
        const updatedAttributes = [...currentAttributes];
        updatedAttributes[existingAttrIndex].value = [
          ...updatedAttributes[existingAttrIndex].value,
          attributeValue,
        ];

        setValue("attributes", updatedAttributes);
      } else {
        // Add new attribute
        setValue("attributes", [
          ...currentAttributes,
          { key: attributeKey, value: [attributeValue] },
        ]);
      }

      // Clear input fields
      setAttributeKey("");
      setAttributeValue("");
    }
  };

  const removeAttribute = (keyToRemove, valueToRemove) => {
    const currentAttributes = getValues("attributes") || [];

    const updatedAttributes = currentAttributes
      .map((attr) => {
        if (attr.key === keyToRemove) {
          // Remove the specific value from the attribute
          const filteredValues = attr.value.filter((v) => v !== valueToRemove);

          // If there are still values left, return the attribute with updated values
          if (filteredValues.length > 0) {
            return { ...attr, value: filteredValues };
          }
          // If no values left, this attribute will be removed entirely
          return null;
        }
        return attr;
      })
      .filter(Boolean); // Remove null entries (attributes with no values)

    setValue("attributes", updatedAttributes);
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      let imageUrls = []; // Handle image uploading if there are files

      if (imageFiles.length > 0) {
        const formData = new FormData();

        // Thêm từng file vào formData với cùng tên "images"
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        console.log(`Đang upload ${imageFiles.length} ảnh...`);

        try {
          // Không cần thiết lập headers ở đây vì đã xử lý trong axiosClient.js
          const uploadResponse = await uploadProductImages(formData);
          console.log("Kết quả upload:", uploadResponse);

          // Xử lý response từ server
          if (uploadResponse?.urls && Array.isArray(uploadResponse.urls)) {
            // Định dạng { urls: [...] } - chuẩn của server
            imageUrls = uploadResponse.urls;
            console.log("Đã nhận được URLs:", imageUrls);
          } else if (
            uploadResponse?.data?.urls &&
            Array.isArray(uploadResponse.data.urls)
          ) {
            // Định dạng { data: { urls: [...] } }
            imageUrls = uploadResponse.data.urls;
            console.log("Đã nhận được URLs từ data:", imageUrls);
          } else if (Array.isArray(uploadResponse)) {
            // Định dạng mảng trực tiếp [url1, url2,...]
            imageUrls = uploadResponse;
            console.log("Đã nhận được URLs dạng mảng:", imageUrls);
          } else if (typeof uploadResponse === "string") {
            // Định dạng string đơn lẻ
            imageUrls = [uploadResponse];
            console.log("Đã nhận được URL đơn:", imageUrls);
          } else if (uploadResponse?.url) {
            // Định dạng { url: "..." }
            imageUrls = [uploadResponse.url];
            console.log("Đã nhận được URL đơn:", imageUrls);
          } else {
            console.error("Định dạng phản hồi không xác định:", uploadResponse);
            throw new Error(
              "Không thể upload ảnh: Phản hồi từ server không hợp lệ"
            );
          }
        } catch (uploadError) {
          console.error("Lỗi upload ảnh:", uploadError);
          throw new Error(
            `Lỗi upload ảnh: ${uploadError.message || "Không xác định"}`
          );
        }
      }

      // Tạo sản phẩm với URLs của ảnh
      const productData = {
        ...data,
        images: imageUrls,
      };

      console.log("Dữ liệu sản phẩm gửi đi:", productData);
      const response = await createProduct(productData);
      console.log("Kết quả tạo sản phẩm:", response);

      if (response?.success || (response && !response.error)) {
        // Dọn dẹp URLs preview
        imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
        // Hiển thị thông báo thành công
        toast.success("Tạo sản phẩm thành công!");
        // Chuyển hướng đến trang danh sách sản phẩm sau một chút để user thấy toast
        setTimeout(() => navigate("/admin/products"), 1200);
      } else {
        throw new Error(
          response?.message || response?.error || "Không thể tạo sản phẩm"
        );
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tạo sản phẩm");
      console.error("Lỗi tạo sản phẩm:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi tạo sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Chi Tiết Sản Phẩm
        </h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 m-6 rounded">{error}</div>
      )}

      {/* Loading state */}
      {(brandsLoading || categoriesLoading) && (
        <div className="flex items-center justify-center p-4 m-6 bg-blue-50 rounded">
          <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Product Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Product Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Tên Sản Phẩm"
                  {...field}
                  error={errors.name?.message}
                  placeholder="Nhập tên sản phẩm"
                />
              )}
            />
            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextAreaField
                  label="Mô Tả Sản Phẩm"
                  {...field}
                  error={errors.description?.message}
                  placeholder="Nhập mô tả sản phẩm"
                />
              )}
            />{" "}
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Danh Mục Sản Phẩm
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categories.map((cat) => ({
                      value: cat._id,
                      label: cat.name,
                    }))}
                    classNamePrefix="select"
                    placeholder="Chọn danh mục sản phẩm"
                    isDisabled={categoriesLoading}
                    onChange={(selected) => {
                      setSelectedCategory(selected);
                      field.onChange(selected?.value);
                    }}
                    value={categories
                      .map((cat) => ({
                        value: cat._id,
                        label: cat.name,
                      }))
                      .find((option) => option.value === field.value)}
                    className={`${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: errors.category
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
                    }}
                  />
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>{" "}
            {/* Brand */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nhãn Hàng
              </label>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={brands.map((brand) => ({
                      value: brand._id,
                      label: brand.name,
                    }))}
                    classNamePrefix="select"
                    placeholder="Chọn nhãn hàng"
                    isDisabled={brandsLoading}
                    onChange={(selected) => {
                      setSelectedBrand(selected);
                      field.onChange(selected?.value);
                    }}
                    value={brands
                      .map((brand) => ({
                        value: brand._id,
                        label: brand.name,
                      }))
                      .find((option) => option.value === field.value)}
                    className={`${
                      errors.brand ? "border-red-500" : "border-gray-300"
                    }`}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: errors.brand
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
                    }}
                  />
                )}
              />
              {errors.brand && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>
            {/* Stock and Price in one row */}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              {/* Attributes */}
              <div className="space-y-2">
                <label
                  htmlFor="attributes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Thuộc Tính Sản Phẩm
                </label>
                <div className="flex gap-2">
                  <input
                    id="attributeKey"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Key (Color, Size...)"
                    value={attributeKey}
                    onChange={(e) => setAttributeKey(e.target.value)}
                  />
                  <input
                    id="attributeValue"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Value (Red, XL...)"
                    value={attributeValue}
                    onChange={(e) => setAttributeValue(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={addAttribute}
                  >
                    +
                  </button>
                </div>

                {/* Display attributes */}
                <Controller
                  name="attributes"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <>
                      {field.value.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((attr, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 rounded p-1"
                              >
                                <strong className="text-xs">{attr.key}:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {attr.value.map((val, valIndex) => (
                                    <span
                                      key={valIndex}
                                      className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                                    >
                                      {val}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeAttribute(attr.key, val)
                                        }
                                        className="ml-1 text-red-500"
                                      >
                                        <RiDeleteBin6Line size={12} />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              {/* Stock */}
              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tồn Kho
                </label>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="stock"
                      type="number"
                      className={`w-full px-3 py-2 border ${
                        errors.stock ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      placeholder="Enter stock quantity"
                    />
                  )}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
            {/* Status and Price in one row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng Thái
                </label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  value={getValues("status")}
                  onChange={(e) => setValue("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giá Sản Phẩm
                </label>
                <input
                  type="number"
                  name="price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  value={getValues("price")}
                  onChange={(e) => setValue("price", e.target.value)}
                />
              </div>
              {/* Discount */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giảm Giá (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  value={getValues("discount")}
                  onChange={(e) => setValue("discount", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Product Gallery */}
          <div className="space-y-6">
            {/* Product Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Gallery
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                  <img
                    src="/images/upload-icon.png"
                    alt="Upload"
                    className="w-12 h-12 mb-2"
                  />
                  <p className="text-sm text-gray-500">
                    Drop your images here, or browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    jpeg, png are allowed
                  </p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 space-y-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center border border-gray-200 rounded p-2"
                    >
                      <div className="w-12 h-12 bg-gray-100 mr-3">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 truncate">
                          Product thumbnail.png
                        </p>
                        <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="ml-2 text-blue-600"
                      >
                        <MdOutlineCheckCircle size={20} />
                      </button>
                    </div>
                  ))}
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
            onClick={() => navigate("/admin/products")}
          >
            Quay Lại
          </button>
          <button
            type="submit"
            disabled={loading || brandsLoading || categoriesLoading}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-red-900 transition disabled:bg-blue-300 uppercase"
          >
            {loading ? (
              <span className="flex items-center">
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              "Tạo Sản Phẩm"
            )}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProductCreate;
