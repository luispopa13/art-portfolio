import React, { useState } from "react";

export default function CustomOrderPage() {
  const [form, setForm] = useState({
    size: "",
    theme: "",
    colors: [],
    description: "",
    email: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    "Black", "White", "Red", "Blue", "Green",
    "Yellow", "Purple", "Pink", "Brown", "Gold",
  ];

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(""); // Clear error when user types
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
    
    // Validare frontend
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
      console.log("Sending custom order:", form);
      
      const res = await fetch("http://localhost:3001/api/create-custom-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not create payment session.");
      }
    } catch (err) {
      console.error("Request error:", err);
      setError("Server error. Make sure the backend is running on port 3001.");
    }

    setLoading(false);
  }

  return (
    <section className="w-full min-h-screen py-24 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Commission a Custom Artwork
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your vision and I'll create a unique piece tailored to your specifications.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-10 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Artwork Specifications
            </h2>
            <p className="text-gray-600">
              Please provide detailed information about your desired artwork.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-900 font-medium mb-2.5 text-sm uppercase tracking-wide">
                  Canvas Size *
                </label>
                <select
                  className="p-3.5 rounded-lg border border-gray-300 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition text-gray-900"
                  value={form.size}
                  onChange={(e) => updateField("size", e.target.value)}
                  required
                >
                  <option value="">Select size</option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-900 font-medium mb-2.5 text-sm uppercase tracking-wide">
                  Theme / Style *
                </label>
                <select
                  className="p-3.5 rounded-lg border border-gray-300 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition text-gray-900"
                  value={form.theme}
                  onChange={(e) => updateField("theme", e.target.value)}
                  required
                >
                  <option value="">Select theme</option>
                  {themes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-900 font-medium mb-2.5 text-sm uppercase tracking-wide">
                Color Palette *
                <span className="text-xs font-normal text-gray-500 ml-2 normal-case tracking-normal">
                  (Select 1-3 colors)
                </span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {colorOptions.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                      form.colors.includes(color)
                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>

              {form.colors.length > 0 && (
                <p className="text-sm text-purple-600 mt-2 font-medium">
                  ✓ Selected: {form.colors.join(", ")}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-900 font-medium mb-2.5 text-sm uppercase tracking-wide">
                Vision & Details *
              </label>
              <textarea
                rows="6"
                className="p-3.5 rounded-lg border border-gray-300 bg-white resize-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition text-gray-900"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your vision in detail — subject, mood, elements, purpose, references..."
                required
                minLength="20"
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.description.length} characters (minimum 20)
              </p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-900 font-medium mb-2.5 text-sm uppercase tracking-wide">
                Contact Email *
              </label>
              <input
                type="email"
                className="p-3.5 rounded-lg border border-gray-300 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition text-gray-900"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-900 font-medium mb-2.5 text-sm uppercase tracking-wide">
                Budget (RON) *
              </label>
              <input
                type="number"
                min="50"
                step="10"
                className="p-3.5 rounded-lg border border-gray-300 bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition text-gray-900"
                placeholder="Minimum: 50 RON"
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum budget is 50 RON
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200"></div>

            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={loading || form.colors.length === 0}
                className="w-full md:w-auto px-12 py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Redirecting to Payment..." : "Submit & Proceed to Payment"}
              </button>
              <p className="text-sm text-gray-500 mt-4 text-center">
                🔒 You will be redirected to a secure Stripe payment page.
              </p>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}