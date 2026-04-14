// backend/routes/adminProductRoutes.js
import express from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// toate rutele de aici sunt protejate
router.use(requireAdmin);

// POST /api/admin/products -> creează produs nou
router.post("/", async (req, res) => {
  try {
    const { title, description, price, size, image, soldOut, tags } = req.body;

    if (!title || price == null || !image) {
      return res.status(400).json({ error: "title, price și image sunt obligatorii" });
    }

    const product = await Product.create({
      title,
      description,
      price,
      size,
      image,
      soldOut: !!soldOut,
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/admin/products/:id -> update produs
router.put("/:id", async (req, res) => {
  try {
    const { title, description, price, size, image, soldOut, tags } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        size,
        image,
        soldOut,
        tags: Array.isArray(tags) ? tags : [],
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/admin/products/:id -> șterge produs
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
