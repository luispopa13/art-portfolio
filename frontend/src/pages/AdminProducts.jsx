/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  RefreshCw,
  Key,
  LogOut,
  Save,
  Edit2,
  Trash2,
  Plus,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Sparkles,
  BarChart2,
  Layers,
  LayoutGrid,
} from "lucide-react";
import PageShell from "../components/PageShell";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../api/products";
import { fetchHomeConfig, updateHomeProductSlot } from "../api/homeConfig";

const ADMIN_TOKEN_KEY = "adminToken";

export default function AdminProducts() {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem(ADMIN_TOKEN_KEY) || ""
  );

  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    size: "",
    image: "",
    soldOut: false,
    inspiration: "",
    tags: "",
    isFeatured: false,
    category: "painting",
    orientation: "portrait", // ✅ NEW
  });

  async function load() {
    setLoadingList(true);
    setError("");
    try {
      const data = await fetchProducts(); // gets all (painting + digital)
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load products");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setMode("create");
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      size: "",
      image: "",
      soldOut: false,
      inspiration: "",
      tags: "",
      isFeatured: false,
      category: "painting",
      orientation: "portrait",
    });
  }

  function startEdit(p) {
    setMode("edit");
    setEditingId(p._id);

    setForm({
      title: p.title || "",
      description: p.description || "",
      price: p.price ?? "",
      size: p.size || "",
      image: p.image || "",
      soldOut: !!p.soldOut,
      inspiration: p.inspiration || "",
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
      isFeatured: !!p.isFeatured,
      category: p.category === "digital" ? "digital" : "painting",
      orientation: p.orientation === "landscape" ? "landscape" : "portrait",
    });
  }

  async function handleUpload(file) {
    if (!file) return;
    if (!adminToken) {
      alert("Missing admin token.");
      return;
    }

    try {
      const { url } = await uploadProductImage(file, adminToken);
      setForm((s) => ({ ...s, image: url }));
    } catch (e) {
      alert(e?.message || "Upload failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!adminToken) {
      setError("Missing admin token.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description,
      price: Number(form.price),
      size: form.size,
      image: form.image,
      soldOut: !!form.soldOut,
      inspiration: form.inspiration,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      isFeatured: !!form.isFeatured,
      category: form.category === "digital" ? "digital" : "painting",
      orientation: form.orientation === "landscape" ? "landscape" : "portrait",
    };

    if (!payload.title || !payload.image || Number.isNaN(payload.price)) {
      setError("Title, image, and numeric price are required.");
      return;
    }

    try {
      if (mode === "create") {
        await createProduct(payload, adminToken);
      } else {
        await updateProduct(editingId, payload, adminToken);
      }
      await load();
      resetForm();
    } catch (e2) {
      setError(e2?.message || "Save failed");
    }
  }

  async function handleDelete(id) {
    if (!adminToken) {
      alert("Missing admin token.");
      return;
    }
    const ok = confirm("Delete this product?");
    if (!ok) return;

    try {
      await deleteProduct(id, adminToken);
      await load();
      if (editingId === id) resetForm();
    } catch (e) {
      alert(e?.message || "Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold">Admin Products</h1>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: FORM */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {mode === "create" ? "Create product" : "Edit product"}
              </h2>
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Admin token</label>
              <input
                value={adminToken}
                onChange={(e) => {
                  const v = e.target.value;
                  setAdminToken(v);
                  localStorage.setItem(ADMIN_TOKEN_KEY, v);
                }}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                placeholder="x-admin-token"
              />
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, title: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Price (RON) *</label>
                  <input
                    value={form.price}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, price: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                    inputMode="decimal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Size</label>
                  <input
                    value={form.size}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, size: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, category: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                  >
                    <option value="painting">Painting</option>
                    <option value="digital">Digital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Orientation</label>
                  <select
                    value={form.orientation}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, orientation: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                  >
                    <option value="portrait">Vertical (Portrait)</option>
                    <option value="landscape">Horizontal (Landscape)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Image *</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, image: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                    placeholder="https://..."
                  />
                  <label className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-sm">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                    />
                  </label>
                </div>

                {form.image && (
                  <div className="mt-3">
                    <img
                      src={form.image}
                      alt="preview"
                      className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-800 object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Tags (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, tags: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                  placeholder="abstract, modern, pastel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Inspiration</label>
                <input
                  value={form.inspiration}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, inspiration: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.soldOut}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, soldOut: e.target.checked }))
                    }
                  />
                  Sold out
                </label>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, isFeatured: e.target.checked }))
                    }
                  />
                  Featured
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3 text-sm font-medium hover:opacity-90"
              >
                {mode === "create" ? "Create product" : "Save changes"}
              </button>
            </form>
          </div>

          {/* RIGHT: LIST */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Products</h2>
              <button
                type="button"
                onClick={load}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Refresh
              </button>
            </div>

            {loadingList ? (
              <p className="mt-4 text-sm text-gray-500">Loading...</p>
            ) : products.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No products yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 p-3"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-800"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{p.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {p.category} • {p.orientation || "portrait"} • {p.price} RON
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-700 dark:border-red-800 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
