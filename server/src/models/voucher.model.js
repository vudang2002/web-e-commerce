import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expireAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu tìm kiếm
voucherSchema.index({ code: 1 });
voucherSchema.index({ isActive: 1 });
voucherSchema.index({ expireAt: 1 });

// Middleware để kiểm tra voucher hết hạn
voucherSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expireAt && this.expireAt < new Date()) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  return true;
};

// Method để tính discount
voucherSchema.methods.calculateDiscount = function (orderValue) {
  if (!this.isValid()) return 0;
  if (orderValue < this.minOrderValue) return 0;

  if (this.discountType === "percentage") {
    return (orderValue * this.amount) / 100;
  } else {
    return Math.min(this.amount, orderValue);
  }
};

const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;
