// frontend/src/api/products.js
import { apiRequest } from "./client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ---------- Produse ----------

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) {
    throw new Error("Product not found");
  }
  return res.json();
}

/**
 * Ia lista de produse.
 * Dacă treci category ("painting" / "digital"), backendul va filtra.
 */
export function fetchProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiRequest(`/api/products${query}`);
}

// ---------- Upload imagine ----------

export async function uploadProductImage(file, adminToken) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    headers: {
      "x-admin-token": adminToken,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Upload error response:", text);
    throw new Error("Failed to upload image");
  }

  return res.json(); // { url }
}

// ---------- Admin Products ----------

export function createProduct(product, adminToken) {
  return apiRequest("/api/admin/products", {
    method: "POST",
    body: product,
    adminToken,
  });
}

export function updateProduct(id, update, adminToken) {
  return apiRequest(`/api/admin/products/${id}`, {
    method: "PUT",
    body: update,
    adminToken,
  });
}

export function deleteProduct(id, adminToken) {
  return apiRequest(`/api/admin/products/${id}`, {
    method: "DELETE",
    adminToken,
  });
}



// Citit config complet de home (public)
export async function fetchHomeConfig() {
  const res = await fetch(`${API_BASE}/api/home-config`);
  if (!res.ok) {
    throw new Error("Failed to fetch home config");
  }
  return res.json();
}

// Asignare produs într-un slot (admin)
export function assignProductToHomeSlot({ productId, slot, action, adminToken }) {
  return apiRequest("/api/admin/home-config/product-slot", {
    method: "POST",
    body: { productId, slot, action },
    adminToken,
  });
}
