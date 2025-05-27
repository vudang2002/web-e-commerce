import React from "react";
import { MdOutlineCheckCircle } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";

const ImageGallery = ({ images, onRemove }) => {
  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Gallery
      </label>
      {images && images.length > 0 ? (
        <div className="mt-4 space-y-2">
          {images.map((url, index) => (
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
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="ml-2 text-primary hover:text-primary-dark"
                >
                  <TiDeleteOutline size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400">Không có ảnh</div>
      )}
    </div>
  );
};

export default ImageGallery;
