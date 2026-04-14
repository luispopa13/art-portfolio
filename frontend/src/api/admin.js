// frontend/src/api/admin.js
import { apiRequest } from "./client";

export function fetchAdminStats(adminToken) {
  return apiRequest("/api/admin/stats", {
    method: "GET",
    adminToken,
  });
}
