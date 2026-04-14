/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import { Link } from "react-router-dom";
import { XCircle, Home, ShoppingBag } from "lucide-react";
import PageShell from "../components/PageShell";

export default function Cancel() {
  useSEO({
    title: "Payment Cancelled",
    description:
      "Your payment was cancelled. No charges were made to your account.",
  });

  return (
    <PageShell
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950"
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
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 px-8 py-12 text-center border-b border-orange-100 dark:border-gray-800 transition-colors duration-300">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-900 rounded-full shadow-lg mb-6 transition-colors duration-300"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <XCircle className="w-12 h-12 text-orange-500" />
              </motion.div>
              <motion.h1
                className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Payment Cancelled
              </motion.h1>
              <motion.p
                className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Your transaction has been cancelled
              </motion.p>
            </div>

            {/* Content Section */}
            <div className="px-8 py-10">
              <motion.div
                className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-xl p-6 mb-8 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 transition-colors duration-300">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  What happened?
                </h2>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-300">
                  No charges were made to your account. Your payment method was
                  not charged, and your order was not processed.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link to="/shop" className="block">
                  <motion.button
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Continue Shopping
                  </motion.button>
                </Link>

                <Link to="/" className="block">
                  <motion.button
                    className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                    whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Home className="w-5 h-5" />
                    Back to Home
                  </motion.button>
                </Link>
              </motion.div>

              {/* Help Text */}
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">
                  Need help or have questions?
                </p>
                <a
                  href="/contact"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm inline-flex items-center gap-1 transition-colors duration-300"
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

          {/* Security Badge */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 transition-colors duration-300">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Your information is secure
            </p>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
