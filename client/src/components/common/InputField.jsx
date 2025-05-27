import React from "react";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  error,
  readOnly = false,
  placeholder = "",
  className = "",
  helperText = "",
  required = false,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {" "}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-${
          readOnly ? "gray-100" : "white"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
    </div>
  );
};

export default InputField;
