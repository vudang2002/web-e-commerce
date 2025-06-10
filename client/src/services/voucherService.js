import axiosClient from "../utils/axiosClient";

// Get all vouchers
export const getVouchers = (params = "") => {
  return axiosClient.get(`/vouchers${params}`);
};

// Get voucher by ID
export const getVoucherById = (id) => {
  return axiosClient.get(`/vouchers/${id}`);
};

// Get voucher by code
export const getVoucherByCode = (code) => {
  return axiosClient.get(`/vouchers/code/${code}`);
};

// Create new voucher
export const createVoucher = (data) => {
  return axiosClient.post("/vouchers", data);
};

// Update voucher
export const updateVoucher = (id, data) => {
  return axiosClient.put(`/vouchers/${id}`, data);
};

// Delete voucher
export const deleteVoucher = (id) => {
  return axiosClient.delete(`/vouchers/${id}`);
};

// Delete multiple vouchers
export const deleteBulkVouchers = (voucherIds) => {
  return axiosClient.delete("/vouchers/bulk", { data: { voucherIds } });
};

// Apply voucher to order
export const applyVoucher = (code, orderTotal) => {
  return axiosClient.post("/vouchers/apply", { code, orderTotal });
};

// Get active vouchers for customers
export const getActiveVouchers = () => {
  return axiosClient.get("/vouchers/active");
};
