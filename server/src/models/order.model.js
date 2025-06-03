import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingInfoSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phoneNo: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingInfo: shippingInfoSchema,
    paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    voucherCode: { type: String },
    voucherDiscount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        "Processing",
        "Confirmed",
        "Shipping",
        "Delivered",
        "Cancelled",
        "Failed",
      ],
      default: "Processing",
    },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
