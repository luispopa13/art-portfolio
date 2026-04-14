/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import ForSale from "../components/ForSale";
import Filters from "../components/Filters";
import ShopSkeleton from "../components/ShopSkeleton";
import PageShell from "../components/PageShell";
import { useProducts } from "../hooks/useProducts";

export default function Shop() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");

  const { products, loading, error } = useProducts();

  useSEO({
    title: "Shop Original Paintings",
    description:
      "Browse our collection of original paintings. Each piece is unique and captures raw emotion through color and form.",
    image: "/og-image.jpg",
  });

  return (
    <PageShell
      className="relative overflow-hidden bg-white dark:bg-gray-950"
      maxWidth="max-w-none"
      noPadding
    >
      {/* Hero Section */}
      <div className="relative pt-16 pb-12 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-6xl md:text-7xl font-light leading-tight mb-4 tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: 'Cinzel, serif' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Shop
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Each piece captures raw emotion through vibrant colors and expressive forms
          </motion.p>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        className="relative px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <Filters
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <div className="relative pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <ShopSkeleton />
          ) : error ? (
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          ) : (
            <ForSale products={products} filter={filter} sort={sort} />
          )}
        </div>
      </div>
    </PageShell>
  );
}