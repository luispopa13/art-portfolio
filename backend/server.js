// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import mongoose from "mongoose";
import multer from "multer";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import contactRoutes from "./routes/contact.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import HomeConfig from "./models/HomeConfig.js";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 3001;
const upload = multer({ dest: "uploads/" });

// -------- Cloudinary config ----------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// servește imaginile uploadate (fallback vechi, încă îl lăsăm)
app.use("/uploads", express.static("uploads"));

// ----------------- SANITY CHECK STRIPE + MONGO -----------------
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ Missing STRIPE_SECRET_KEY in .env");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin-token-change-me";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------- EMAIL (NODEMAILER) -----------------
let mailTransporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  mailTransporter
    .verify()
    .then(() => {
      console.log("✉️ SMTP transporter ready");
    })
    .catch((err) => {
      console.error("❌ SMTP config error:", err);
      mailTransporter = null;
    });
} else {
  console.warn(
    "✉️ SMTP not fully configured. Confirmation emails will NOT be sent."
  );
}

async function sendOrderConfirmationEmail(order, session) {
  if (!mailTransporter) {
    console.log("✉️ Skipping email: transporter not configured");
    return;
  }

  const metadata = order.metadata || {};
  const customerDetails = session.customer_details || {};

  const to =
    order.customerEmail ||
    customerDetails.email ||
    metadata.email ||
    session.customer_email ||
    null;

  if (!to) {
    console.log("✉️ Skipping email: no customer email found");
    return;
  }

  if (order.status !== "paid") {
    console.log("✉️ Skipping email: order status is not 'paid'");
    return;
  }

  const createdAt = order.createdAt || new Date();
  const formattedDate = createdAt.toLocaleString("ro-RO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsRows = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 4px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:right;">
          ${item.unitPrice.toFixed(2)} RON
        </td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:right;">
          ${item.lineTotal.toFixed(2)} RON
        </td>
      </tr>
    `
    )
    .join("");

  const customBlock =
    order.type === "custom"
      ? `
      <h3 style="margin:24px 0 8px;font-size:16px;">Custom artwork details</h3>
      <ul style="padding-left:18px;font-size:14px;line-height:1.6;">
        ${
          metadata.size
            ? `<li><strong>Size:</strong> ${metadata.size}</li>`
            : ""
        }
        ${
          metadata.theme
            ? `<li><strong>Theme:</strong> ${metadata.theme}</li>`
            : ""
        }
        ${
          metadata.colors
            ? `<li><strong>Colors:</strong> ${metadata.colors}</li>`
            : ""
        }
        ${
          metadata.location
            ? `<li><strong>Location:</strong> ${metadata.location}</li>`
            : ""
        }
      </ul>
    `
      : "";

  const html = `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5;color:#111827;">
    <h2 style="font-size:20px;margin-bottom:12px;">Thank you for your order! 🖼️</h2>
    <p style="margin:0 0 12px;">We have received your payment and your order is now being processed.</p>

    <p style="margin:0 0 8px;">
      <strong>Order ID:</strong> ${order._id}<br/>
      <strong>Date:</strong> ${formattedDate}<br/>
      <strong>Total:</strong> ${order.totalAmount.toFixed(
        2
      )} ${order.currency.toUpperCase()}
    </p>

    <h3 style="margin:24px 0 8px;font-size:16px;">Order items</h3>
    <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 4px;border-bottom:1px solid #e5e7eb;">Item</th>
          <th style="text-align:center;padding:8px 4px;border-bottom:1px solid #e5e7eb;">Qty</th>
          <th style="text-align:right;padding:8px 4px;border-bottom:1px solid #e5e7eb;">Unit</th>
          <th style="text-align:right;padding:8px 4px;border-bottom:1px solid #e5e7eb;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    ${customBlock}

    <p style="margin-top:24px;font-size:14px;">
      We will contact you shortly with delivery details and timing.<br/>
      If you have any questions, just reply to this email.
    </p>

    <p style="margin-top:16px;font-size:13px;color:#6b7280;">
      Thank you for supporting our art! 💜
    </p>
  </div>
  `;

  const subject =
    order.type === "custom"
      ? `Your custom artwork order – ${order.totalAmount.toFixed(2)} RON`
      : `Order confirmation – ${order.totalAmount.toFixed(2)} RON`;

  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM || `"Art by Misa" <no-reply@example.com>`,
    to,
    subject,
    html,
  });

  console.log(`✉️ Confirmation email sent to ${to}`);
}

// ----------------- MIDDLEWARES -----------------
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-admin-token"],
    credentials: true,
  })
);

// ----------------- ADMIN AUTH (SIMPLE) -----------------
function adminOnly(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized (admin only)" });
  }

  next();
}

// helper – config de home (unic în DB)
async function getOrCreateHomeConfig() {
  let cfg = await HomeConfig.findOne();
  if (!cfg) {
    cfg = await HomeConfig.create({});
  }
  // sigurăm arrays
  cfg.carouselProducts = cfg.carouselProducts || [];
  cfg.galleryProducts = cfg.galleryProducts || [];
  return cfg;
}

// ----------------- ROUTES EXISTENTE -----------------
app.use("/api", contactRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "✅ Server running",
    time: new Date().toISOString(),
  });
});

// ----------------- PRODUCTS API -----------------

// GET toate produsele (cu filtrare opțională după category)
app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category && ["painting", "digital"].includes(category)) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET un singur produs
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ----------------- ADMIN PRODUCTS API -----------------

// Creează produs nou
app.post("/api/admin/products", adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      size,
      image,
      soldOut,
      inspiration,
      tags,
      isFeatured,
      category,
      orientation, // ✅ NEW
    } = req.body;

    const priceNumber = Number(price);

    if (!title || image == null || Number.isNaN(priceNumber)) {
      return res
        .status(400)
        .json({ error: "Title, numeric price și image sunt obligatorii" });
    }

    const normalizedCategory = category === "digital" ? "digital" : "painting";

    const normalizedOrientation =
      orientation === "landscape" ? "landscape" : "portrait";

    const product = await Product.create({
      title,
      description: description || "",
      price: priceNumber,
      size: size || "",
      image,
      soldOut: !!soldOut,
      inspiration: inspiration || "",
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: !!isFeatured,
      category: normalizedCategory,
      orientation: normalizedOrientation, // ✅ NEW
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});


// Update produs
app.put("/api/admin/products/:id", adminOnly, async (req, res) => {
  try {
    const update = { ...req.body };

    if (update.price !== undefined) {
      const priceNumber = Number(update.price);
      if (Number.isNaN(priceNumber)) {
        return res.status(400).json({ error: "Price must be a number" });
      }
      update.price = priceNumber;
    }

    if (update.tags && !Array.isArray(update.tags)) {
      update.tags = [update.tags];
    }

    if (update.category !== undefined) {
      if (!["painting", "digital"].includes(update.category)) {
        return res.status(400).json({ error: "Invalid category" });
      }
    }

    // ✅ NEW: validate orientation
    if (update.orientation !== undefined) {
      if (!["portrait", "landscape"].includes(update.orientation)) {
        return res.status(400).json({ error: "Invalid orientation" });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Șterge produs
app.delete("/api/admin/products/:id", adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    // scoatem și din config de home
    const cfg = await getOrCreateHomeConfig();
    cfg.hero1Product =
      cfg.hero1Product?.toString() === req.params.id ? null : cfg.hero1Product;
    cfg.hero2Product =
      cfg.hero2Product?.toString() === req.params.id ? null : cfg.hero2Product;
    cfg.carouselProducts = (cfg.carouselProducts || []).filter(
      (id) => id.toString() !== req.params.id
    );
    cfg.galleryProducts = (cfg.galleryProducts || []).filter(
      (id) => id.toString() !== req.params.id
    );
    await cfg.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Upload imagine produs (ADMIN) -> Cloudinary
app.post(
  "/api/admin/upload",
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;

      const baseName =
        req.file.originalname?.split(".").slice(0, -1).join(".") || "artwork";

      const folder = process.env.CLOUDINARY_FOLDER || "art-portfolio";

      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        public_id: `${Date.now()}_${baseName}`,
        overwrite: false,
        resource_type: "image",
      });

      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn("⚠️ Failed to remove temp file:", err.message);
        }
      });

      console.log("✅ Image uploaded to Cloudinary:", result.secure_url);
      res.json({ url: result.secure_url });
    } catch (err) {
      console.error("❌ Upload error:", err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

// ----------------- HOME CONFIG (homepage slots) -----------------
app.get("/api/home-config", async (req, res) => {
  try {
    // căutăm config-ul; dacă nu există, îl creăm gol
    let cfg = await HomeConfig.findOne();

    if (!cfg) {
      cfg = await HomeConfig.create({});
    }

    const populated = await HomeConfig.findById(cfg._id)
      .populate("hero1Product")
      .populate("hero2Product")
      .populate("carouselProducts")
      .populate("galleryProducts")
      .lean();

    res.json(populated);
  } catch (err) {
    console.error("❌ Error fetching home-config:", err);
    res.status(500).json({ error: "Failed to fetch home-config" });
  }
});


// ----------------- HOME CONFIG (product slots) -----------------
app.post(
  "/api/admin/home-config/product-slot",
  adminOnly,
  async (req, res) => {
    try {
      const { productId, slot, action } = req.body;

      if (!productId || !slot || !action) {
        return res
          .status(400)
          .json({ error: "productId, slot și action sunt obligatorii" });
      }

      const productExists = await Product.exists({ _id: productId });
      if (!productExists) {
        return res.status(404).json({ error: "Product not found" });
      }

      const cfg = await getOrCreateHomeConfig();
      const act = action === "remove" ? "remove" : "add";

      switch (slot) {
        case "hero1":
          cfg.hero1Product = act === "remove" ? null : productId;
          break;
        case "hero2":
          cfg.hero2Product = act === "remove" ? null : productId;
          break;
        case "carousel":
          if (!cfg.carouselProducts) cfg.carouselProducts = [];
          if (act === "add") {
            if (!cfg.carouselProducts.some((id) => id.toString() === productId)) {
              cfg.carouselProducts.push(productId);
            }
          } else {
            cfg.carouselProducts = cfg.carouselProducts.filter(
              (id) => id.toString() !== productId
            );
          }
          break;
        case "gallery":
          if (!cfg.galleryProducts) cfg.galleryProducts = [];
          if (act === "add") {
            if (!cfg.galleryProducts.some((id) => id.toString() === productId)) {
              cfg.galleryProducts.push(productId);
            }
          } else {
            cfg.galleryProducts = cfg.galleryProducts.filter(
              (id) => id.toString() !== productId
            );
          }
          break;
        default:
          return res.status(400).json({ error: "Invalid slot" });
      }

      await cfg.save();

      // populate corect: pe QUERY, nu pe document
      const populated = await HomeConfig.findById(cfg._id)
        .populate("hero1Product")
        .populate("hero2Product")
        .populate("carouselProducts")
        .populate("galleryProducts")
        .lean();

      res.json(populated);
    } catch (err) {
      console.error("❌ Error updating product slot:", err);
      res.status(500).json({ error: "Failed to update home config" });
    }
  }
);

// ----------------- STRIPE CHECKOUT (SHOP CART) -----------------
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    console.log("📦 Received cart:", req.body.cart);

    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const lineItems = cart.map((item) => {
      console.log(
        `Processing item: ${item.title}, price: ${item.price}, qty: ${item.quantity}`
      );

      return {
        price_data: {
          currency: "ron",
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    console.log("💳 Creating Stripe session with items:", lineItems);
    console.log("🌐 Frontend URL:", FRONTEND_URL);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
      metadata: {
        type: "shop",
        cart: JSON.stringify(
          cart.map((i) => ({
            title: i.title,
            price: Number(i.price),
            quantity: i.quantity || 1,
          }))
        ),
      },
    });

    console.log("✅ Checkout session created:", session.id);
    console.log("🔗 Redirect URL:", session.url);

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- STRIPE CUSTOM ORDER -----------------
app.post("/api/create-custom-checkout", async (req, res) => {
  try {
    const { size, theme, colors, description, email, budget, location } =
      req.body;

    if (!size || !theme || !email || !budget) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!colors || colors.length === 0) {
      return res
        .status(400)
        .json({ error: "Please select at least one color" });
    }

    const budgetNum = Number(budget);

    if (Number.isNaN(budgetNum) || budgetNum < 50) {
      return res.status(400).json({ error: "Minimum budget is 50 RON" });
    }

    console.log("🌐 Frontend URL:", FRONTEND_URL);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: {
              name: `Custom Painting – ${theme}`,
              description: `Size: ${size}\nColors: ${colors.join(
                ", "
              )}\n\nDetails: ${description.substring(0, 200)}`,
            },
            unit_amount: Math.round(budgetNum * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "custom",
        size,
        theme,
        colors: colors.join(", "),
        email,
        location: location || "",
      },
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    console.log("✅ Custom order session created:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Custom order Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ORDERS CONFIRM / STATS -----------------
app.post("/api/orders/confirm", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    console.log("🔔 /api/orders/confirm called with:", sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const paymentStatus =
      session.payment_status || session.status || "unknown";

    let metadata = {};
    try {
      metadata = session.metadata || {};
      if (metadata.cart && typeof metadata.cart === "string") {
        metadata.cart = JSON.parse(metadata.cart);
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse metadata.cart:", e);
    }

    const customerEmail =
      session.customer_details?.email ||
      metadata.email ||
      session.customer_email ||
      null;

    const lineItems = session.line_items?.data || [];
    const items = lineItems.map((li) => {
      const qty = li.quantity || 1;
      const lineTotal = (li.amount_total || 0) / 100;
      const unitPrice = lineTotal / qty;
      return {
        name: li.description,
        quantity: qty,
        unitPrice,
        lineTotal,
      };
    });

    const itemsCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

    const totalAmount = (session.amount_total || 0) / 100;
    const currency = session.currency || "ron";

    let order = await Order.findOne({ stripeSessionId: sessionId });

    if (order) {
      console.log(
        "ℹ️ Order already exists in DB, maybe updating / sending email"
      );

      order.status = paymentStatus;
      order.totalAmount = totalAmount;
      order.itemsCount = itemsCount;
      order.items = items;
      order.metadata = metadata;
      if (customerEmail && !order.customerEmail) {
        order.customerEmail = customerEmail;
      }
      await order.save();

      if (!order.emailSent && paymentStatus === "paid") {
        try {
          await sendOrderConfirmationEmail(order, session);
          order.emailSent = true;
          await order.save();
        } catch (e) {
          console.error("❌ Failed to send confirmation email:", e);
        }
      }

      return res.json(order);
    }

    // nu există încă order -> îl creăm
    order = await Order.create({
      stripeSessionId: session.id,
      type: metadata.type || "shop",
      status: paymentStatus,
      currency,
      totalAmount,
      itemsCount,
      items,
      metadata,
      customerEmail,
      emailSent: false,
    });

    console.log("✅ Order stored:", order._id);

    if (paymentStatus === "paid") {
      try {
        await sendOrderConfirmationEmail(order, session);
        order.emailSent = true;
        await order.save();
      } catch (e) {
        console.error("❌ Failed to send confirmation email:", e);
      }
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Error confirming order:", err);
    res.status(500).json({ error: "Failed to confirm order" });
  }
});

// Stats pentru dashboard admin
app.get("/api/admin/stats", adminOnly, async (req, res) => {
  try {
    const matchPaid = { status: "paid" };

    const [summary] = await Order.aggregate([
      { $match: matchPaid },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          totalItems: { $sum: "$itemsCount" },
        },
      },
    ]);

    const since30Days = new Date();
    since30Days.setDate(since30Days.getDate() - 30);

    const dailyRaw = await Order.aggregate([
      { $match: { ...matchPaid, createdAt: { $gte: since30Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const daily = dailyRaw.map((d) => ({
      date: d._id,
      revenue: d.revenue,
      orders: d.orders,
    }));

    const since12Months = new Date();
    since12Months.setMonth(since12Months.getMonth() - 11);

    const monthlyRaw = await Order.aggregate([
      { $match: { ...matchPaid, createdAt: { $gte: since12Months } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthly = monthlyRaw.map((m) => ({
      month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
      revenue: m.revenue,
      orders: m.orders,
    }));

    res.json({
      summary: {
        totalRevenue: summary?.totalRevenue || 0,
        totalOrders: summary?.totalOrders || 0,
        totalItems: summary?.totalItems || 0,
      },
      daily,
      monthly,
    });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ----------------- MONGO + SERVER START -----------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
