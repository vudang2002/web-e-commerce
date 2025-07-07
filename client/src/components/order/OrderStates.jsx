import React from "react";
import { useTranslation } from "react-i18next";
import { FiPackage, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

// Loading Skeleton Component
const LoadingSkeleton = React.memo(({ count = 3 }) => (
  <div className="space-y-6">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
      >
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Items Skeleton */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="space-y-2">
            {[...Array(2)].map((_, j) => (
              <div
                key={j}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

// Empty State Component
const EmptyState = React.memo(({ onCreateOrder }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <FiPackage className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('orders.states.no_orders_yet')}</h2>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto">
        {t('orders.states.no_orders_message')}
      </p>
      <button
        onClick={onCreateOrder}
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <FiPackage className="w-5 h-5 mr-2" />
        {t('orders.states.start_shopping')}
      </button>
    </div>
  );
});

// Error State Component
const ErrorState = React.memo(({ message, onRetry }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <FiAlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {t('orders.states.failed_to_load')}
      </h2>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto">
        {message || t('orders.states.error_message')}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <FiRefreshCw className="w-5 h-5 mr-2" />
        {t('orders.states.try_again')}
      </button>
    </div>
  );
});

// Set display names
LoadingSkeleton.displayName = "LoadingSkeleton";
EmptyState.displayName = "EmptyState";
ErrorState.displayName = "ErrorState";

// Export individual components
export { LoadingSkeleton, EmptyState, ErrorState };

// Export as object with named exports
const OrderStates = {
  LoadingSkeleton,
  EmptyState,
  ErrorState,
};

export default OrderStates;
