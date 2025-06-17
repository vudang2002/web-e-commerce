import React from "react";

const StatCard = ({ title, value, icon: Icon, color, subtext }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4 transition-transform hover:scale-105"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
