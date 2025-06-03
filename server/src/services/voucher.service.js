import Voucher from "../models/voucher.model.js";

// Tạo voucher mới
export const createVoucher = async (voucherData) => {
  try {
    const voucher = new Voucher(voucherData);
    await voucher.save();
    return voucher;
  } catch (error) {
    throw error;
  }
};

// Lấy tất cả voucher
export const getAllVouchers = async (query = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      isActive,
      discountType,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive;
    if (discountType) filter.discountType = discountType;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const vouchers = await Voucher.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Voucher.countDocuments(filter);

    return {
      vouchers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

// Lấy voucher theo ID
export const getVoucherById = async (voucherId) => {
  try {
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  } catch (error) {
    throw error;
  }
};

// Lấy voucher theo code
export const getVoucherByCode = async (code) => {
  try {
    const voucher = await Voucher.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });
    return voucher;
  } catch (error) {
    throw error;
  }
};

// Cập nhật voucher
export const updateVoucher = async (voucherId, updateData) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(voucherId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  } catch (error) {
    throw error;
  }
};

// Xóa voucher
export const deleteVoucher = async (voucherId) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(voucherId);
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  } catch (error) {
    throw error;
  }
};

// Kiểm tra và áp dụng voucher
export const applyVoucher = async (voucherCode, orderValue) => {
  try {
    const voucher = await getVoucherByCode(voucherCode);

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    if (!voucher.isValid()) {
      if (!voucher.isActive) {
        throw new Error("Voucher is not active");
      }
      if (voucher.expireAt && voucher.expireAt < new Date()) {
        throw new Error("Voucher has expired");
      }
      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        throw new Error("Voucher usage limit exceeded");
      }
    }

    if (orderValue < voucher.minOrderValue) {
      throw new Error(`Minimum order value is ${voucher.minOrderValue}`);
    }

    const discountAmount = voucher.calculateDiscount(orderValue);

    return {
      voucher,
      discountAmount,
      finalAmount: orderValue - discountAmount,
    };
  } catch (error) {
    throw error;
  }
};

// Đánh dấu voucher đã được sử dụng
export const markVoucherAsUsed = async (voucherCode) => {
  try {
    const voucher = await Voucher.findOneAndUpdate(
      { code: voucherCode.toUpperCase() },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
    return voucher;
  } catch (error) {
    throw error;
  }
};

// Lấy voucher có thể sử dụng cho user
export const getAvailableVouchers = async (orderValue = 0) => {
  try {
    const vouchers = await Voucher.find({
      isActive: true,
      $or: [{ expireAt: { $gte: new Date() } }, { expireAt: null }],
      $expr: {
        $or: [
          { $eq: ["$usageLimit", null] },
          { $lt: ["$usedCount", "$usageLimit"] },
        ],
      },
      minOrderValue: { $lte: orderValue },
    }).sort({ amount: -1 });

    return vouchers;
  } catch (error) {
    throw error;
  }
};
