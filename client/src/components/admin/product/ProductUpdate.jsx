import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../../services/productService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../common/InputField";
import TextAreaField from "../../common/TextAreaField";
import SelectField from "../../common/SelectField";
import AttributesDisplay from "../../common/AttributesDisplay";
import AttributeEditor from "../../common/AttributeEditor";
import ImageGallery from "../../common/ImageGallery";
import { useBrands, useCategories } from "../../../hooks/useProductData";
import { uploadProductImages } from "../../../services/uploadService";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((res) => {
        if (res?.success && res.data) {
          setProduct(res.data);
          setFormData(res.data);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi lấy chi tiết sản phẩm");
      })
      .finally(() => setLoading(false));
  }, [id]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý toggle isFeatured
  const handleToggleFeatured = () => {
    setFormData({ ...formData, isFeatured: !formData.isFeatured });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateProduct(id, formData)
      .then((res) => {
        if (res?.success) {
          toast.success("Cập nhật sản phẩm thành công!");
          setTimeout(() => navigate(`/admin/products`), 1200); // Quay lại trang chi tiết sau khi hiển thị thông báo
        } else {
          toast.error("Cập nhật sản phẩm thất bại");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Lỗi khi cập nhật sản phẩm");
      })
      .finally(() => setLoading(false));
  };

  // Xử lý upload ảnh khi chọn ảnh mới
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      try {
        const formDataUpload = new FormData();
        acceptedFiles.forEach((file) => {
          formDataUpload.append("images", file);
        });
        // Upload lên server
        const uploadRes = await uploadProductImages(formDataUpload);
        let uploadedUrls = [];
        if (uploadRes?.urls && Array.isArray(uploadRes.urls)) {
          uploadedUrls = uploadRes.urls;
        } else if (
          uploadRes?.data?.urls &&
          Array.isArray(uploadRes.data.urls)
        ) {
          uploadedUrls = uploadRes.data.urls;
        } else if (Array.isArray(uploadRes)) {
          uploadedUrls = uploadRes;
        } else if (typeof uploadRes === "string") {
          uploadedUrls = [uploadRes];
        } else if (uploadRes?.url) {
          uploadedUrls = [uploadRes.url];
        }
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
        }));
        toast.success("Upload ảnh thành công!");
      } catch (err) {
        toast.error("Lỗi upload ảnh: " + (err.message || "Không xác định"));
      }
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 10,
  });

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
        <span>Đang tải chi tiết sản phẩm...</span>
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 text-red-600 p-4 m-6 rounded">{error}</div>
    );
  if (!product) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Cập Nhật Sản Phẩm
        </h1>
      </div>
      <form className="p-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Product Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Product Name */}
            <InputField
              label="Tên Sản Phẩm"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              placeholder="Nhập tên sản phẩm"
            />
            {/* Description */}
            <TextAreaField
              label="Mô Tả Sản Phẩm"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Nhập mô tả sản phẩm"
            />
            {/* Category */}
            <SelectField
              label="Danh Mục Sản Phẩm"
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              options={categories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))}
            />
            {/* Brand */}
            <SelectField
              label="Nhãn Hàng"
              name="brand"
              value={formData.brand || ""}
              onChange={handleInputChange}
              options={brands.map((brand) => ({
                value: brand._id,
                label: brand.name,
              }))}
            />
            {/* Stock and Attributes in one row */}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              {/* Attributes */}
              <div className="space-y-2">
                <AttributesDisplay
                  attributes={formData.attributes || []}
                  onRemove={(key, value) => {
                    const updatedAttributes = formData.attributes
                      .map((attr) => {
                        if (attr.key === key) {
                          return {
                            ...attr,
                            value: attr.value.filter((v) => v !== value),
                          };
                        }
                        return attr;
                      })
                      .filter((attr) => attr.value.length > 0);
                    setFormData({ ...formData, attributes: updatedAttributes });
                  }}
                />
                <AttributeEditor
                  onAddAttribute={(newAttribute) => {
                    const currentAttributes = formData.attributes || [];
                    // Kiểm tra xem thuộc tính đã tồn tại chưa
                    const existingAttrIndex = currentAttributes.findIndex(
                      (attr) => attr.key === newAttribute.key
                    );

                    let updatedAttributes;
                    if (existingAttrIndex >= 0) {
                      // Nếu thuộc tính đã tồn tại, hợp nhất các giá trị mới vào
                      updatedAttributes = [...currentAttributes];
                      const existingValues = new Set(
                        updatedAttributes[existingAttrIndex].value
                      );
                      newAttribute.value.forEach((val) =>
                        existingValues.add(val)
                      );
                      updatedAttributes[existingAttrIndex].value =
                        Array.from(existingValues);
                    } else {
                      // Nếu là thuộc tính mới, thêm vào danh sách
                      updatedAttributes = [...currentAttributes, newAttribute];
                    }

                    setFormData({ ...formData, attributes: updatedAttributes });
                    toast.success(`Đã thêm thuộc tính: ${newAttribute.key}`);
                  }}
                />
              </div>
              {/* Stock */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tồn Kho
                </label>
                <input
                  type="number"
                  name="stock"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  value={formData.stock || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>{" "}
            {/* Status, Price and Featured in one row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng Thái
                </label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  value={formData.status || ""}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  value={formData.price || 0}
                  onChange={handleInputChange}
                />
              </div>
              {/* Featured Toggle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sản Phẩm Nổi Bật
                </label>
                <div className="flex items-center h-10">
                  <button
                    type="button"
                    onClick={handleToggleFeatured}
                    className={`flex items-center justify-center px-4 py-2 rounded-md ${
                      formData.isFeatured
                        ? "bg-yellow-400 text-white hover:bg-yellow-500"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors`}
                  >
                    <FaStar
                      className={`mr-2 ${
                        formData.isFeatured ? "text-white" : "text-gray-500"
                      }`}
                    />
                    {formData.isFeatured ? "Đã Ghim" : "Ghim Sản Phẩm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Product Gallery */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Gallery
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
              <ImageGallery
                images={formData.images || []}
                onRemove={(index) => {
                  const updatedImages = formData.images.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, images: updatedImages });
                }}
              />
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition uppercase"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProductUpdate;
