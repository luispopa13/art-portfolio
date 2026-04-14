/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function GallerySection({ products = [] }) {
  const artworks = useMemo(() => {
    const fallback = [
      { id: 1, title: "Golden Hour", size: "40×50 cm", image: "/gallery/p5.png", orientation: "portrait" },
      { id: 2, title: "Midnight Bloom", size: "50×70 cm", image: "/gallery/p6.png", orientation: "portrait" },
      { id: 3, title: "Dreamscape", size: "30×40 cm", image: "/gallery/p7.png", orientation: "portrait" },
      { id: 4, title: "Soft Chaos", size: "20×30 cm", image: "/gallery/p8.png", orientation: "portrait" },
      { id: 5, title: "Abstract Rose", size: "40×50 cm", image: "/gallery/p9.png", orientation: "portrait" },
      { id: 6, title: "Pastel Nights", size: "60×80 cm", image: "/gallery/p10.png", orientation: "portrait" },
    ];

    // map products -> artworks
    let list;
    if (!Array.isArray(products) || products.length === 0) {
      list = fallback;
    } else {
      const candidates = products.filter((p) => p && p.image);
      if (candidates.length === 0) {
        list = fallback;
      } else {
        list = candidates.slice(0, 6).map((p, idx) => {
          const fb = fallback[idx % fallback.length];
          return {
            id: p._id || p.id || fb.id || idx,
            title: p.title || fb.title,
            size: p.size || fb.size,
            image: p.image,
            orientation: p.orientation === "landscape" ? "landscape" : "portrait",
            // păstrăm o cheie de ordine stabilă (ca să nu “sară” la rerender)
            _order: idx,
          };
        });
      }
    }

    // ✅ GROUPING: portrait first, then landscape (stable sort)
    const portrait = list.filter((a) => a.orientation !== "landscape");
    const landscape = list.filter((a) => a.orientation === "landscape");

    // dacă vrei să păstrezi ordinea inițială în interiorul fiecărui grup:
    portrait.sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
    landscape.sort((a, b) => (a._order ?? 0) - (b._order ?? 0));

    // cleanup private key
    const merged = [...portrait, ...landscape].map(({ _order, ...rest }) => rest);
    return merged;
  }, [products]);

  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-5xl md:text-6xl font-light text-gray-900 dark:text-gray-100 mb-6 tracking-tight"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Gallery
          </h2>
          <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 mx-auto" />
        </motion.div>

        {/* ✅ 2 columns, portrait-first list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {artworks.map((art, idx) => {
            const isLandscape = art.orientation === "landscape";
            const aspect = isLandscape ? "aspect-[3/2]" : "aspect-[4/5]";
            const maxW = isLandscape ? "max-w-[620px]" : "max-w-[440px]";

            return (
              <motion.div
                key={art.id}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
              >
                <div className={`mx-auto w-full ${maxW}`}>
                  <div className={`relative ${aspect} overflow-hidden bg-gray-100 dark:bg-gray-900`}>
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover transform group-hover:scale-[1.02] transition duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="mt-4 text-center space-y-1">
                    <h3 className="text-sm font-light text-gray-900 dark:text-white">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {art.size}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
