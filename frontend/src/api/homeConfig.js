// frontend/src/api/homeConfig.js
import { apiRequest } from "./client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchHomeConfig() {
  const res = await fetch(`${API_BASE}/api/home-config`);
  if (!res.ok) {
    throw new Error("Failed to fetch home config");
  }
  return res.json();
}

/**
 * ADMIN: setează / scoate un produs dintr-un slot (hero/carousel/gallery)
 * slot: "hero1" | "hero2" | "carousel" | "gallery"
 * action: "add" | "remove"
 */
export function updateHomeProductSlot({ productId, slot, action, adminToken }) {
  return apiRequest("/api/admin/home-config/product-slot", {
    method: "POST",
    adminToken,
    body: { productId, slot, action },
  });
}
