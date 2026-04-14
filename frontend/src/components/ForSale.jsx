/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useMemo } from "react";
import PaintingCard from "./PaintingCard";

function normalizeOrientation(p) {
  return p?.orientation === "landscape" ? "landscape" : "portrait";
}

export default function ForSale({
  products = [],
  filter = "all",
  sort = "none",
  title = "Paintings for Sale",
  subtitle = "Discover unique pieces crafted with passion and creativity",
  emptyTitle = "No paintings found",
  emptyMessage = "Try adding products from the admin panel.",
}) {
  const filtered = useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    // ---- filter by price (your existing logic)
    let tmp = list;
    if (filter === "cheap") {
      tmp = tmp.filter((p) => Number(p.price) < 400);
    } else if (filter === "premium") {
      tmp = tmp.filter((p) => Number(p.price) >= 400);
    }

    // ---- sort (your existing logic)
    if (sort === "price-asc") {
      tmp = [...tmp].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc") {
      tmp = [...tmp].sort((a, b) => Number(b.price) - Number(a.price));
    }

    // ---- group: portrait first, then landscape (but keep your sort inside each group)
    const portrait = [];
    const landscape = [];

    for (const p of tmp) {
      if (normalizeOrientation(p) === "landscape") landscape.push(p);
      else portrait.push(p);
    }

    // If sorting is "none", keep original order inside each group.
    // If sorting is price-based, both groups already sorted because tmp sorted above,
    // but splitting preserves order, so this is OK.

    return [...portrait, ...landscape];
  }, [products, filter, sort]);

  return (
    <section className="relative px-6 py-20 max-w-7xl mx-auto transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative">
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500 dark:to-purple-400"></div>
          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            Available Artwork
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500 dark:to-purple-400"></div>
        </motion.div>

        <motion.h2
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        // ✅ 2 per row (sm and up)
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {filtered.map((p) => (
          <PaintingCard
            key={p._id || p.id}
            id={p._id || p.id}
            image={p.image}
            title={p.title}
            price={p.price}
            size={p.size}
            soldOut={!!p.soldOut}
            orientation={normalizeOrientation(p)} // ✅ critical
          />
        ))}
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {emptyTitle}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
        </motion.div>
      )}
    </section>
  );
}
