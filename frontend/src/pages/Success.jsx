/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import { useCart } from "../context/CartContext";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import PageShell from "../components/PageShell";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Success() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useSEO({
    title: "Payment Successful - Thank You!",
    description:
      "Your order has been confirmed. Thank you for supporting our art!",
  });

  // 1) Golește coșul O SINGURĂ DATĂ, la mount
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Confirmă comanda O SINGURĂ DATĂ per sessionId
  useEffect(() => {
    if (!sessionId) return;

    const storageKey = `order_confirmed_${sessionId}`;
    if (sessionStorage.getItem(storageKey)) {
      return; // deja confirmată, nu mai chemăm backend-ul
    }
    sessionStorage.setItem(storageKey, "1");

    (async () => {
      try {
        await fetch(`${API_BASE}/api/orders/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (err) {
        console.error("Failed to confirm order:", err);
      }
    })();
  }, [sessionId]);

  return (
    <PageShell
      className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950"
      maxWidth="max-w-2xl"
    >
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full">
          {/* Main Card */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-8 py-12 text-center border-b border-emerald-100 dark:border-gray-800 transition-colors duration-300">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-900 rounded-full shadow-lg mb-6 transition-colors duration-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </motion.div>
              <motion.h1
                className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Payment Successful!
              </motion.h1>
              <motion.p
                className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Your order has been confirmed
              </motion.p>
            </div>

            {/* Content Section */}
            <div className="px-8 py-10">
              {/* Success Message */}
              <motion.div
                className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl p-6 mb-8 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 transition-colors duration-300">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  What happens next?
                </h2>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-300">
                  Thank you for your purchase! We will contact you shortly with
                  details about your artwork and delivery information.
                </p>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                className="space-y-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg transition-colors duration-300">
                  Next Steps:
                </h3>
                <div className="space-y-3">
                  {[
                    "You'll receive an order confirmation email within the next few minutes",
                    "Our team will reach out to discuss artwork details and delivery",
                    "Your artwork will be carefully prepared and shipped to you",
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.9 + index * 0.1,
                      }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center transition-colors duration-300">
                        <span className="text-emerald-600 dark:text-emerald-300 text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 pt-0.5 transition-colors duration-300">
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Link to="/" className="block">
                  <motion.button
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Home className="w-5 h-5" />
                    Back to Home
                  </motion.button>
                </Link>

                <Link to="/shop" className="block">
                  <motion.button
                    className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors durataion-300"
                    whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Continue Shopping
                  </motion.button>
                </Link>
              </motion.div>

              {/* Help Text */}
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors durataion-300">
                  Questions about your order?
                </p>
                <a
                  href="/contact"
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm inline-flex items-center gap-1 transition-colors durataion-300"
                >
                  Contact Support
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 transition-colors durataion-300">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Thank you for supporting our art!
            </p>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
