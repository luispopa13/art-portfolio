/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import PageShell from "../components/PageShell";
import PaintingCard from "../components/PaintingCard";

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <PageShell className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your saved artworks in one place. ({favorites.length} items)
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              Clear all
            </button>
          )}
        </motion.div>

        {/* Empty state */}
        {favorites.length === 0 && (
          <motion.div
            className="rounded-2xl p-10 text-center border border-dashed border-gray-300 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-5xl mb-4">♡</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tap the ♡ icon on any painting to save it here.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors duration-300"
            >
              Browse Paintings
            </Link>
          </motion.div>
        )}

        {/* Grid of favorites */}
        {favorites.length > 0 && (
          <motion.div
            key={`favorites-grid-${favorites.length}`}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {favorites.map((p) => (
              <PaintingCard
                key={p.id}
                id={p.id}
                image={p.image}
                title={p.title}
                price={p.price}
                size={p.size || ""}
                soldOut={p.soldOut || false}
              />
            ))}
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}