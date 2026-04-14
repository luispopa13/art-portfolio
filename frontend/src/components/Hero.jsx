/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useProducts } from "../hooks/useProducts";

export default function Hero() {
  // Luăm produsele din backend
  const { products } = useProducts();

  // Construim strip-ul de 5 imagini de sus, din backend + fallback local
  const stripImages = useMemo(() => {
    const fallback = [
      "/gallery/p9.png",
      "/gallery/p8.png",
      "/gallery/p10.png",
      "/gallery/p7.png",
      "/gallery/p5.png",
    ];

    if (!products || products.length === 0) {
      return fallback;
    }

    // produse disponibile cu imagine
    const available = products.filter((p) => p.image && !p.soldOut);

    // dacă ai flag de featured, îl folosim prioritar
    const featured = available.filter((p) => p.isFeatured);
    const source = featured.length >= 5 ? featured : available;

    const selected = source.slice(0, 5);
    const result = selected.map((p) => p.image);

    // dacă sunt mai puține de 5, completăm cu fallback
    let i = 0;
    while (result.length < 5 && i < fallback.length) {
      result.push(fallback[i]);
      i++;
    }

    return result;
  }, [products]);

  function scrollToGallery() {
    const section = document.getElementById("gallery");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="relative w-full bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Top Image Strip - cu imaginile tale (acum din backend + fallback) */}
      <div className="relative w-full pt-20">
        <motion.div
          className="grid grid-cols-5 h-48 md:h-56"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {stripImages.map((src, idx) => (
            <div key={idx} className="overflow-hidden">
              <img
                src={src}
                alt={`artwork ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Center Text Content - minimalist (nemodificat) */}
      <motion.div
        className="relative py-20 px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          {/* Title with visual accent */}
          <div className="space-y-6">
            <div className="inline-block">
              <h1
                className="text-6xl md:text-7xl font-light text-gray-900 dark:text-gray-100 tracking-tight mb-3"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Art by Maise
              </h1>
              <div className="h-px bg-gradient-to-r from-gray-900 via-gray-400 to-transparent dark:from-gray-100 dark:via-gray-600 dark:to-transparent" />
            </div>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl font-light mt-8 mx-auto">
              I have been painting for over five years, exploring color, emotion,
              and human expression through intimate and vibrant compositions.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button
              onClick={scrollToGallery}
              className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-normal tracking-wide hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-300 shadow-sm"
            >
              View Gallery
            </button>

            <button
              onClick={() => (window.location.href = "/custom-order")}
              className="px-8 py-3 border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 text-sm font-normal tracking-wide hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-all duration-300"
            >
              Custom Order
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-200 dark:border-gray-800 max-w-md mx-auto">
            <div className="text-center">
              <div
                className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-gray-100 mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                5<span className="text-lg">+</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 tracking-widest font-light">
                YEARS
              </div>
            </div>

            <div className="text-center">
              <div
                className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-gray-100 mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                100<span className="text-lg">+</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 tracking-widest font-light">
                PIECES
              </div>
            </div>

            <div className="text-center">
              <div
                className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-gray-100 mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                50<span className="text-lg">+</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 tracking-widest font-light">
                CLIENTS
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
