/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import FormProgress from "../components/FormProgress";
import SecurityBanner from "../components/SecurityBanner";
import TrustBadges from "../components/TrustBadges";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function CustomOrderPage() {
  const [form, setForm] = useState({
    size: "",
    theme: "",
    colors: [],
    description: "",
    email: "",
    budget: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useSEO({
    title: "Commission Custom Artwork",
    description:
      "Commission a unique custom painting tailored to your vision. Choose size, theme, colors, and share your artistic vision with us.",
    image: "/og-image.jpg",
  });

  const sizes = ["20×30 cm", "30×40 cm", "40×60 cm", "50×70 cm", "Custom size"];
  const themes = [
    "Portrait",
    "Abstract",
    "Landscape",
    "Nature",
    "Minimalist",
    "Romantic",
    "Vibrant / Colorful",
    "Dark / Dramatic",
  ];
  const colorOptions = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Pink",
    "Brown",
    "Gold",
  ];

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function toggleColor(color) {
    setForm((f) => {
      if (f.colors.includes(color)) {
        return { ...f, colors: f.colors.filter((c) => c !== color) };
      }
      if (f.colors.length >= 3) return f;
      return { ...f, colors: [...f.colors, color] };
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.colors.length === 0) {
      setError("Please select at least one color");
      return;
    }

    if (Number(form.budget) < 50) {
      setError("Budget must be at least 50 RON");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/create-custom-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned invalid response format");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        setTimeout(() => {
          window.location.href = data.url;
        }, 100);
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (err) {
      setError(err.message || "Server error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <motion.section
      className="w-full min-h-screen py-24 bg-white dark:bg-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-5xl md:text-6xl font-light leading-tight mb-4 tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Commission a Custom Artwork
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Share your vision and I'll create a unique piece tailored to your
            specifications.
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12 rounded-lg border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
              Artwork Specifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Please provide detailed information about your desired artwork.
            </p>
          </div>

          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-700 font-medium dark:text-red-300">
                {error}
              </p>
              <button
                onClick={() => setError("")}
                className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:text-red-800"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          <FormProgress
            form={form}
            requiredFields={[
              "size",
              "theme",
              "colors",
              "description",
              "email",
              "budget",
              "location",
            ]}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* size + theme */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-900 dark:text-gray-100 font-medium mb-2 text-sm">
                  Canvas Size *
                </label>
                <select
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 transition text-gray-900 dark:text-gray-100"
                  value={form.size}
                  onChange={(e) => updateField("size", e.target.value)}
                  required
                >
                  <option value="">Select size</option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-900 dark:text-gray-100 font-medium mb-2 text-sm">
                  Theme / Style *
                </label>
                <select
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 transition text-gray-900 dark:text-gray-100"
                  value={form.theme}
                  onChange={(e) => updateField("theme", e.target.value)}
                  required
                >
                  <option value="">Select theme</option>
                  {themes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* location */}
            <div className="flex flex-col">
              <label className="text-gray-900 dark:text-gray-100 font-medium mb-2 text-sm">
                Delivery Location *
              </label>
              <input
                type="text"
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 transition text-gray-900 dark:text-gray-100"
                placeholder="City, country or full address (for shipping estimate)"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                required
              />
            </div>

            {/* colors */}
            <div className="flex flex-col">
              <label className="text-gray-900 dark:text-gray-100 font-medium mb-2 text-sm">
                Color Palette *
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                  (Select 1-3 colors)
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <motion.button
                    type="button"
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                      form.colors.includes(color)
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                        : "bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {color}
                  </motion.button>
                ))}
              </div>

              {form.colors.length > 0 && (
                <motion.p
                  className="text-sm text-gray-600 dark:text-gray-400 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Selected: {form.colors.join(", ")}
                </motion.p>
              )}
            </div>

            {/* description */}
            <div className="flex flex-col">
              <label className="text-gray-900 dark:text-gray-100 font-medium mb-2 text-sm">
                Vision & Details *
              </label>
              <textarea
                rows="6"
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 resize-none focus:border-gray-900 dark:focus:border-gray-100 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 transition text-gray-900 dark:text-gray-100"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your vision in detail — subject, mood, elements, purpose, references..."
                required
                minLength="20"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {form.description.length} characters (minimum 20)
              </p>
            </div>

            {/* email */}
            <div className="flex flex-col">
              <label className="text-gray-900 dark:text-gray-100 font-medium mb-2 text-sm">
                Contact Email *
              </label>
              <input
                type="email"
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 transition text-gray-900 dark:text-gray-100"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* budget */}
            <div className="flex flex-col">
              <label className="text-gray-900 dark:text-gray-100 font-medium mb-2 text-sm">
                Budget (RON) *
              </label>
              <input
                type="number"
                min="50"
                step="10"
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100 transition text-gray-900 dark:text-gray-100"
                placeholder="Minimum: 50 RON"
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum budget is 50 RON
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800" />

            <div className="flex flex-col items-center">
              <motion.button
                type="submit"
                disabled={loading || form.colors.length === 0}
                className="w-full md:w-auto px-12 py-4 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={
                  !loading && form.colors.length > 0 ? { scale: 1.02 } : {}
                }
                whileTap={
                  !loading && form.colors.length > 0 ? { scale: 0.98 } : {}
                }
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Redirecting to Payment...
                  </span>
                ) : (
                  "Submit & Proceed to Payment"
                )}
              </motion.button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                You will be redirected to a secure Stripe payment page.
              </p>
            </div>
          </form>

          <div className="mt-10 space-y-6">
            <SecurityBanner />
            <TrustBadges />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}