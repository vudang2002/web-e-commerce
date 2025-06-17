import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiChevronRight } from "react-icons/fi";

const Breadcrumb = ({ items = [] }) => {
  // Default breadcrumb always starts with Home
  const breadcrumbItems = [
    {
      label: "Trang chủ",
      path: "/",
      icon: <FiHome className="w-4 h-4" />,
    },
    ...items,
  ];

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <FiChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}

                {isLast ? (
                  // Last item (current page) - not clickable
                  <span className="flex items-center text-gray-500 font-medium">
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </span>
                ) : (
                  // Clickable breadcrumb items
                  <Link
                    to={item.path}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
