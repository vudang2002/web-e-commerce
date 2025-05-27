import React, { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

const AttributeEditor = ({ onAddAttribute }) => {
  const [attributeKey, setAttributeKey] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [attributeValues, setAttributeValues] = useState([]);
  
  const handleAddValue = () => {
    if (attributeValue.trim()) {
      setAttributeValues([...attributeValues, attributeValue.trim()]);
      setAttributeValue("");
    }
  };

  const handleRemoveValue = (index) => {
    const newValues = [...attributeValues];
    newValues.splice(index, 1);
    setAttributeValues(newValues);
  };

  const handleAddAttribute = () => {
    if (attributeKey.trim() && attributeValues.length > 0) {
      onAddAttribute({
        key: attributeKey,
        value: attributeValues
      });
      // Reset form
      setAttributeKey("");
      setAttributeValue("");
      setAttributeValues([]);
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 mt-4">
      <h3 className="font-medium text-sm mb-2">Thêm thuộc tính mới</h3>
      
      {/* Attribute Key */}
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Tên thuộc tính
        </label>
        <input
          type="text"
          value={attributeKey}
          onChange={(e) => setAttributeKey(e.target.value)}
          className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none"
          placeholder="Ví dụ: Màu sắc, Kích thước..."
        />
      </div>
      
      {/* Attribute Values */}
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Giá trị thuộc tính
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none"
            placeholder="Ví dụ: Đỏ, XL..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
          />
          <button
            type="button"
            onClick={handleAddValue}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
          >
            Thêm
          </button>
        </div>
      </div>
      
      {/* Display added values */}
      {attributeValues.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1 border-t border-gray-100 pt-2">
            {attributeValues.map((value, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
              >
                {value}
                <button
                  type="button"
                  onClick={() => handleRemoveValue(index)}
                  className="ml-1 text-red-500"
                >
                  <RiDeleteBin6Line size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Add attribute button */}
      <button
        type="button"
        onClick={handleAddAttribute}
        disabled={!attributeKey.trim() || attributeValues.length === 0}
        className={`w-full flex items-center justify-center gap-1 px-2 py-1 rounded text-sm ${
          !attributeKey.trim() || attributeValues.length === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        <IoAddCircle size={16} />
        Thêm thuộc tính
      </button>
    </div>
  );
};

export default AttributeEditor;
