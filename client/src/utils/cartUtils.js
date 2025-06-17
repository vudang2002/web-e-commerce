import { calculateDiscountedPrice } from "./formatters";

// Environment check
export const isDevelopment = import.meta.env.DEV;

// Logger with condition
export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  }
};

// Calculate selected items data
export const calculateSelectedData = (cartItems, selectedItems) => {
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item._id)
  );
  
  const selectedTotalPrice = selectedCartItems.reduce((total, item) => {
    const discountedPrice = calculateDiscountedPrice(
      item.product.price || 0,
      item.product.discount || 0
    );
    return total + discountedPrice * item.quantity;
  }, 0);
  
  const selectedTotalItems = selectedCartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return {
    selectedCartItems,
    selectedTotalPrice,
    selectedTotalItems,
  };
};
