// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, default: "" },
    image: { type: String, required: true },

    soldOut: { type: Boolean, default: false },
    inspiration: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },

    category: {
      type: String,
      enum: ["painting", "digital"],
      default: "painting",
      index: true,
    },

    // ✅ NEW
    orientation: {
      type: String,
      enum: ["portrait", "landscape"],
      default: "portrait",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
