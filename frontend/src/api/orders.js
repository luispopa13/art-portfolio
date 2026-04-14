// frontend/src/api/orders.js
import { apiRequest } from "./client";

export function confirmOrderFromSession(sessionId) {
  return apiRequest("/api/orders/confirm", {
    method: "POST",
    body: { sessionId },
  });
}
