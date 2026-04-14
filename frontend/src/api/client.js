// frontend/src/api/client.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Wrapper simplu peste fetch pentru API-ul nostru.
 */
export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    adminToken,
    headers: extraHeaders = {},
  } = options;

  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (adminToken) {
    headers["x-admin-token"] = adminToken;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export { API_URL };
