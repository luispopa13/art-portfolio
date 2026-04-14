// backend/models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    name: String,
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 }, // RON
    lineTotal: { type: Number, default: 0 }, // RON
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    stripeSessionId: { type: String, index: true, unique: true },
    type: { type: String, enum: ["shop", "custom"], default: "shop" },
    status: { type: String, default: "paid" }, // Stripe: paid / unpaid etc.
    currency: { type: String, default: "ron" },
    totalAmount: { type: Number, default: 0 }, // RON
    itemsCount: { type: Number, default: 0 },
    items: [OrderItemSchema],
    metadata: { type: Object },

    // pentru email client
    customerEmail: { type: String },
    emailSent: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Order", OrderSchema);
