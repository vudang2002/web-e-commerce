// Utility functions to extract data from API responses
export const extractOrders = (data) => {
  if (!data) return [];

  if (data.success && Array.isArray(data.success)) {
    return data.success;
  }
  if (data.orders && Array.isArray(data.orders)) {
    return data.orders;
  }
  if (data.data?.orders && Array.isArray(data.data.orders)) {
    return data.data.orders;
  }
  if (data.data?.data?.orders && Array.isArray(data.data.data.orders)) {
    return data.data.data.orders;
  }
  if (Array.isArray(data.data)) {
    return data.data;
  }
  if (Array.isArray(data)) {
    return data;
  }

  console.warn("Could not extract orders from API response");
  return [];
};

export const extractProducts = (data) => {
  if (!data) return [];

  if (data.success && Array.isArray(data.success)) {
    return data.success;
  }
  if (data.products && Array.isArray(data.products)) {
    return data.products;
  }
  if (data.data?.products && Array.isArray(data.data.products)) {
    return data.data.products;
  }
  if (data.data?.data?.products && Array.isArray(data.data.data.products)) {
    return data.data.data.products;
  }
  if (Array.isArray(data.data)) {
    return data.data;
  }
  if (Array.isArray(data)) {
    return data;
  }

  console.warn("Could not extract products from API response");
  return [];
};

export const extractUsers = (data) => {
  if (!data) return [];

  if (data.success && Array.isArray(data.success)) {
    return data.success;
  }
  if (data.users && Array.isArray(data.users)) {
    return data.users;
  }
  if (data.data?.users && Array.isArray(data.data.users)) {
    return data.data.users;
  }
  if (data.data?.data?.users && Array.isArray(data.data.data.users)) {
    return data.data.data.users;
  }
  if (Array.isArray(data.data)) {
    return data.data;
  }
  if (Array.isArray(data)) {
    return data;
  }

  console.warn("Could not extract users from API response");
  return [];
};

// Calculate dashboard statistics
export const calculateStats = (orders, products, users) => {
  // Calculate total orders
  const totalOrders = orders.length;

  // Calculate total revenue from completed orders
  const completedOrders = orders.filter(
    (order) => order.orderStatus === "Completed"
  );
  const totalRevenue = completedOrders.reduce((sum, order) => {
    return sum + (order.totalPrice || 0);
  }, 0);

  // Calculate total customers (filter by role)
  const customers = users.filter(
    (user) => !user.role || user.role === "customer" || user.role === "user"
  );
  const totalCustomers = customers.length;

  // Calculate total products
  const totalProducts = products.length;

  return {
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
  };
};

// Get top selling products
export const getTopProducts = (products, limit = 5) => {
  if (products.length === 0) return [];

  return products
    .filter((product) => product.sold > 0)
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, limit);
};

// Format currency
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 ₫";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format number
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return "0";
  }
  return new Intl.NumberFormat("vi-VN").format(number);
};
