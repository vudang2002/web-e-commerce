import { useState } from "react";

const AttributeBuilder = ({ value = [], onChange }) => {
  const [attributes, setAttributes] = useState(value);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: "", value: [""] }]);
  };

  const handleAttributeChange = (index, field, fieldValue) => {
    const updated = [...attributes];
    updated[index][field] = fieldValue;
    setAttributes(updated);
    onChange(updated);
  };

  const handleValueChange = (index, valIndex, newVal) => {
    const updated = [...attributes];
    updated[index].value[valIndex] = newVal;
    setAttributes(updated);
    onChange(updated);
  };

  const handleAddValue = (index) => {
    const updated = [...attributes];
    updated[index].value.push("");
    setAttributes(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Attributes</h3>
      {attributes.map((attr, index) => (
        <div key={index} className="border p-3 rounded bg-gray-50 space-y-2">
          <input
            type="text"
            placeholder="Attribute Name (e.g. Color)"
            className="w-full px-2 py-1 border rounded"
            value={attr.key}
            onChange={(e) =>
              handleAttributeChange(index, "key", e.target.value)
            }
          />
          {attr.value.map((val, valIndex) => (
            <input
              key={valIndex}
              type="text"
              placeholder="Attribute Value"
              className="w-full px-2 py-1 border rounded"
              value={val}
              onChange={(e) =>
                handleValueChange(index, valIndex, e.target.value)
              }
            />
          ))}
          <button
            type="button"
            className="text-sm text-blue-600"
            onClick={() => handleAddValue(index)}
          >
            + Add Value
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddAttribute}
        className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
      >
        + Add Attribute
      </button>
    </div>
  );
};

export default AttributeBuilder;
