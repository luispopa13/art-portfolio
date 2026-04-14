// frontend/src/pages/Checkout.jsx
import { useCart } from "../context/CartContext";
import { useState } from "react";
import CheckoutProgress from "../components/ProgressCheckout";
import PriceSummary from "../components/PriceSummary";
import SecurityBanner from "../components/SecurityBanner";
import TrustBadges from "../components/TrustBadges";

export default function Checkout() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    if (cart.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🛒 Sending cart to backend:", cart);

      const res = await fetch(
        "http://localhost:3001/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart }),
        }
      );

      console.log("📡 Response status:", res.status);
      console.log("📡 Response OK:", res.ok);

      const contentType = res.headers.get("content-type");
      console.log("📄 Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("❌ Server returned non-JSON:", text);
        throw new Error("Server error - please check if backend is running");
      }

      const data = await res.json();
      console.log("📦 Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (!data.url) {
        console.error("❌ No URL in response:", data);
        throw new Error("No checkout URL received from server");
      }

      console.log("✅ Redirecting to:", data.url);

      try {
        new URL(data.url);
        window.location.href = data.url;
      } catch {
        console.error("❌ Invalid URL received:", data.url);
        throw new Error("Invalid checkout URL received");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setError(err.message || "Something went wrong! Please try again.");
      setLoading(false);
    }
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const isEmpty = cart.length === 0;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-gradient-to-br from-slate-50 via-stone-100 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <CheckoutProgress currentStep={2} />

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
          Checkout
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
            <p className="text-red-700 dark:text-red-300 font-medium">
              ❌ {error}
            </p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {isEmpty ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-colors duration-300">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 transition-colors duration-300">
              Your cart is empty.
            </p>
            <a
              href="/shop"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition inline-block"
            >
              Go to Shop
            </a>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-[2fr,1.2fr] gap-8 items-start">
              {/* LEFT: Cart items */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-7 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        className="w-20 h-20 rounded-lg object-cover"
                        alt={item.title}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                          {item.price} RON × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {item.price * item.quantity} RON
                    </p>
                  </div>
                ))}
              </div>

              {/* RIGHT: Summary + security */}
              <div className="space-y-6">
                <PriceSummary
                  totalPrice={totalPrice}
                  onCheckout={handlePayment}
                  loading={loading}
                  buttonText={
                    loading ? "Redirecting to Stripe..." : "Proceed to Payment"
                  }
                />
                <SecurityBanner />
              </div>
            </div>

            <div className="mt-8">
              <TrustBadges />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
