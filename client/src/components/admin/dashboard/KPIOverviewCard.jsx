import React from "react";
import { FiBarChart } from "react-icons/fi";

const KPIOverviewCard = ({ stats, formatCurrency, formatNumber }) => {
  const kpiItems = [
    {
      label: "Doanh thu",
      value: formatCurrency(stats.totalRevenue),
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      valueColor: "text-blue-900",
    },
    {
      label: "Đơn hàng",
      value: formatNumber(stats.totalOrders),
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      valueColor: "text-green-900",
    },
    {
      label: "Khách hàng",
      value: formatNumber(stats.totalCustomers),
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900",
    },
    {
      label: "Sản phẩm",
      value: formatNumber(stats.totalProducts),
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      valueColor: "text-red-900",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FiBarChart className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Tổng quan KPI</h2>
      </div>
      <div className="space-y-4">
        {kpiItems.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 ${item.bgColor} rounded-lg`}
          >
            <span className={`font-medium ${item.textColor}`}>
              {item.label}
            </span>
            <span className={`font-bold ${item.valueColor}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIOverviewCard;
