// frontend/src/api/adminStats.js
import { apiRequest } from "./client";

export function fetchAdminStats(adminToken) {
  return apiRequest("/api/admin/stats", {
    method: "GET",
    adminToken,
  });
}
