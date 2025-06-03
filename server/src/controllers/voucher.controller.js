import * as voucherService from "../services/voucher.service.js";

// Tạo voucher mới
export const createVoucher = async (req, res) => {
  try {
    const voucher = await voucherService.createVoucher(req.body);
    res.status(201).json({
      success: true,
      message: "Voucher created successfully",
      data: voucher,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy tất cả voucher
export const getAllVouchers = async (req, res) => {
  try {
    const result = await voucherService.getAllVouchers(req.query);
    res.status(200).json({
      success: true,
      message: "Vouchers retrieved successfully",
      data: result.vouchers,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy voucher theo ID
export const getVoucherById = async (req, res) => {
  try {
    const voucher = await voucherService.getVoucherById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Voucher retrieved successfully",
      data: voucher,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy voucher theo code
export const getVoucherByCode = async (req, res) => {
  try {
    const voucher = await voucherService.getVoucherByCode(req.params.code);
    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Voucher not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Voucher retrieved successfully",
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cập nhật voucher
export const updateVoucher = async (req, res) => {
  try {
    const voucher = await voucherService.updateVoucher(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Voucher updated successfully",
      data: voucher,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa voucher
export const deleteVoucher = async (req, res) => {
  try {
    await voucherService.deleteVoucher(req.params.id);
    res.status(200).json({
      success: true,
      message: "Voucher deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Kiểm tra và áp dụng voucher
export const applyVoucher = async (req, res) => {
  try {
    const { voucherCode, orderValue } = req.body;

    if (!voucherCode || !orderValue) {
      return res.status(400).json({
        success: false,
        message: "Voucher code and order value are required",
      });
    }

    const result = await voucherService.applyVoucher(voucherCode, orderValue);

    res.status(200).json({
      success: true,
      message: "Voucher applied successfully",
      data: {
        voucherCode: result.voucher.code,
        discountType: result.voucher.discountType,
        discountAmount: result.discountAmount,
        originalAmount: orderValue,
        finalAmount: result.finalAmount,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy voucher có thể sử dụng
export const getAvailableVouchers = async (req, res) => {
  try {
    const { orderValue } = req.query;
    const vouchers = await voucherService.getAvailableVouchers(
      parseFloat(orderValue) || 0
    );

    res.status(200).json({
      success: true,
      message: "Available vouchers retrieved successfully",
      data: vouchers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
