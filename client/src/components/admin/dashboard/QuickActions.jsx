import React from "react";
import { FiShoppingCart, FiPackage, FiUsers, FiBarChart } from "react-icons/fi";

const QuickActions = () => {
  const actions = [
    {
      icon: FiShoppingCart,
      title: "Quản lý đơn hàng",
      hoverColor: "hover:border-blue-500 hover:bg-blue-50",
    },
    {
      icon: FiPackage,
      title: "Quản lý sản phẩm",
      hoverColor: "hover:border-green-500 hover:bg-green-50",
    },
    {
      icon: FiUsers,
      title: "Quản lý khách hàng",
      hoverColor: "hover:border-yellow-500 hover:bg-yellow-50",
    },
    {
      icon: FiBarChart,
      title: "Báo cáo & Thống kê",
      hoverColor: "hover:border-purple-500 hover:bg-purple-50",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Thao tác nhanh
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg ${action.hoverColor} transition-colors`}
            >
              <Icon className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
