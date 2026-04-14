/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";

export default function PaintingCard({
  id,
  image,
  title,
  price,
  size,
  soldOut = false,
  orientation = "portrait",
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  function handleToggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id,
      image,
      title,
      price,
      size: size || "",
      soldOut: soldOut || false,
      orientation,
    });
  }

  const isLandscape = orientation === "landscape";

  // aspect ratio stays correct
  const frameAspect = isLandscape ? "aspect-[3/2]" : "aspect-[4/5]";

  // ✅ size control (portrait smaller)
  // - portrait gets a max width so it doesn't look oversized
  // - landscape stays wider
  const frameMaxWidth = isLandscape ? "max-w-[560px]" : "max-w-[420px]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Link to={`/product/${id}`}>
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
          className="group relative cursor-pointer"
        >
          {/* ✅ FRAME (now constrained in width) */}
          <div className={`mx-auto w-full ${frameMaxWidth}`}>
            <div className="bg-white dark:bg-gray-900 border-8 border-white dark:border-gray-800 shadow-2xl overflow-hidden">
              <div className={`relative ${frameAspect} overflow-hidden`}>
                <motion.img
                  src={image}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* FAVORITE */}
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  aria-label={
                    favorite ? "Remove from favorites" : "Add to favorites"
                  }
                  className="absolute top-3 right-3 z-20 rounded-full bg-white/95 dark:bg-gray-900/95 p-2 shadow-lg hover:scale-110 active:scale-95 transition"
                >
                  <svg
                    className={`w-4 h-4 ${
                      favorite
                        ? "text-pink-500"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                    viewBox="0 0 24 24"
                    fill={favorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.995 5.75c-1.54-1.787-4.237-2.006-5.93-.305-1.717 1.725-1.717 4.52 0 6.245l5.28 5.302a1.25 1.25 0 001.77 0l5.28-5.302c1.717-1.725 1.717-4.52 0-6.245-1.693-1.701-4.39-1.482-5.93.305z"
                    />
                  </svg>
                </button>

                {/* SOLD OUT */}
                {soldOut && (
                  <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                    SOLD OUT
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div className="mt-5 text-center space-y-2 px-3">
            <h3
              className="text-lg font-normal text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {title}
            </h3>

            {size && (
              <p className="text-xs text-gray-500 dark:text-gray-500 font-light tracking-wide">
                {size}
              </p>
            )}

            <p
              className={`text-2xl font-light transition-colors ${
                soldOut
                  ? "text-gray-400 dark:text-gray-600 line-through"
                  : "text-gray-900 dark:text-white"
              }`}
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {price} RON
            </p>

            {soldOut && (
              <p className="text-red-600 dark:text-red-400 text-xs font-normal">
                Not Available
              </p>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
