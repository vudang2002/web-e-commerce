import React from "react";

const TextInput = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input ref={ref} className="w-full border rounded p-2" {...props} />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
});

export default TextInput;
