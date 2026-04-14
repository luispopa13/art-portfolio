/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeProvider";
import { Moon, Sun, Heart } from "lucide-react";
import { motion } from "framer-motion";
import CartDrawer from "./CartDrawer";
import { useFavorites } from "../context/FavoritesContext";

export default function Navbar() {
  const { totalQuantity } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { favorites } = useFavorites();
  const favoritesCount = favorites.length;

  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md dark:shadow-gray-900/50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            onMouseEnter={() => import("../pages/Home")}
            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 text-transparent bg-clip-text"
          >
            Art by Maise
          </Link>

          <ul className="flex space-x-8 text-lg font-medium text-gray-700 dark:text-gray-300 items-center">
            {/* HOME */}
            <li className="hover:text-purple-500 dark:hover:text-purple-400 transition cursor-pointer">
              <Link to="/" onMouseEnter={() => import("../pages/Home")}>
                Home
              </Link>
            </li>

            {/* SHOP DROPDOWN – CLICK TO OPEN/CLOSE */}
            <li className="relative cursor-pointer">
              <button
                type="button"
                onClick={() => setIsShopOpen((o) => !o)}
                className="flex items-center gap-1 hover:text-pink-500 dark:hover:text-pink-400 transition"
              >
                <span>Shop</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isShopOpen ? "rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className={`absolute left-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 w-48 z-30 ${
                  isShopOpen ? "block" : "hidden"
                }`}
              >
                <Link
                  to="/shop"
                  onMouseEnter={() => import("../pages/Shop")}
                  onClick={() => setIsShopOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Paintings
                </Link>
                <Link
                  to="/digital-prints"
                  onMouseEnter={() => import("../pages/DigitalPrints")}
                  onClick={() => setIsShopOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Digital prints
                </Link>
              </div>
            </li>

            {/* CUSTOM */}
            <li className="hover:text-yellow-500 dark:hover:text-yellow-400 transition cursor-pointer">
              <Link
                to="/custom-order"
                onMouseEnter={() => import("../pages/CustomOrderPage")}
              >
                Custom
              </Link>
            </li>
            <li className="transition cursor-pointer">
              <Link
                to="/favorites"
                onMouseEnter={() => import("../pages/Favorites")}
                className="flex items-center gap-2 hover:text-rose-500 dark:hover:text-rose-400"
              >
                <Heart
                  className={`w-5 h-5 transition 
                    ${
                      favoritesCount > 0
                        ? "text-rose-500 fill-rose-500 dark:text-rose-400 dark:fill-rose-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                />
                <span>Favorites</span>
                {favoritesCount > 0 && (
                  <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </li>

            {/* THEME TOGGLE */}
            <li>
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isDark ? (
                    <Moon className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                </motion.div>
              </motion.button>
            </li>

            {/* CART ICON */}
            <li>
              <button
                onClick={() => setIsCartOpen(true)}
                onMouseEnter={() => import("../pages/Checkout")}
                className="relative text-2xl hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                🛒
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs 
                    w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
