import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const AttributesDisplay = ({ attributes, onRemove }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Thuộc Tính Sản Phẩm
      </label>
      {attributes && attributes.length > 0 ? (
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            {attributes.map((attr, index) => (
              <div key={index} className="border border-gray-200 rounded p-1">
                <strong className="text-xs">{attr.key}:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {attr.value.map((val, valIndex) => (
                    <span
                      key={valIndex}
                      className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                    >
                      {val}
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(attr.key, val)}
                          className="ml-1 text-red-500"
                        >
                          <RiDeleteBin6Line size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-400">Không có thuộc tính</div>
      )}
    </div>
  );
};

export default AttributesDisplay;
