/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import GallerySection from "../components/GallerySection";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useProducts } from "../hooks/useProducts";
import { fetchHomeConfig } from "../api/homeConfig";


export default function Home() {
  useSEO({
    title: "Art by Maise - Original Paintings & Custom Artwork",
    description:
      "Explore unique original paintings that capture emotion and beauty. Commission custom artwork tailored to your vision.",
    image: "/og-image.jpg",
  });

  // Produse din backend – doar tablouri (painting)
  const { products, loading, error } = useProducts("painting");

  // Config de home (hero1, hero2, carousel, gallery)
  const [homeConfig, setHomeConfig] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const cfg = await fetchHomeConfig();
        setHomeConfig(cfg || null);
      } catch (err) {
        console.error("Failed to load home config", err);
      }
    })();
  }, []);


  const hero1Product = homeConfig?.hero1Product || null;
  const hero2Product = homeConfig?.hero2Product || null;
  const carouselProducts = homeConfig?.carouselProducts || [];
  const galleryProducts = homeConfig?.galleryProducts || [];

  const heroBigImage =
    hero1Product?.image ||
    (products && products[0] && products[0].image
      ? products[0].image
      : "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2400&q=90");

  // Three column left image – prioritate: gallery[0] -> products[0] -> fallback
  const threeColLeftImage =
    (galleryProducts[0] && galleryProducts[0].image) ||
    (products && products[0] && products[0].image
      ? products[0].image
      : "/gallery/p3.png");

  // Three column right image – prioritate: gallery[1] -> products[1] -> fallback
  const threeColRightImage =
    (galleryProducts[1] && galleryProducts[1].image) ||
    (products && products[1] && products[1].image
      ? products[1].image
      : "/gallery/p9.png");

  // 5. Another large image – prioritate: hero2Product -> products[3] -> fallback vechi
  const secondLargeImage =
    hero2Product?.image ||
    (products && products[3] && products[3].image
      ? products[3].image
      : "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=2400&q=90");

  // Pentru Carousel / GallerySection:
  // - dacă în HomeConfig ai setat carouselProducts / galleryProducts -> le folosim pe alea
  // - altfel folosim toate produsele (comportament vechi)
  const carouselData =
    carouselProducts.length > 0 ? carouselProducts : products || [];
  const galleryData =
    galleryProducts.length > 0 ? galleryProducts : products || [];

  return (
    <PageShell
      className="relative overflow-hidden bg-white dark:bg-gray-950"
      maxWidth="max-w-none"
      noPadding
    >
      {/* 1. HERO - image strip + text */}
      <div className="relative">
        <Hero />
      </div>

      {/* 2. LARGE IMAGE - folosește hero1 dacă există */}
      <section className="relative w-full h-[40vh]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={heroBigImage}
            alt="artwork detail"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* 3. CAROUSEL - primește imagini din HomeConfig (dacă există) */}
      <div className="relative" id="gallery">
        <Carousel products={carouselData} loading={loading} error={error} />
      </div>

      {/* 4. THREE COLUMN SECTION - imagine | quote | imagine */}
      <section className="relative bg-white dark:bg-gray-950 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 items-center">
            {/* Left Image - cu ramă */}
            <motion.div
              className="aspect-[2/3] p-2 bg-white dark:bg-gray-900 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-full border-2 border-gray-100 dark:border-gray-800">
                <img
                  src={threeColLeftImage}
                  alt={products?.[0]?.title || "painting process"}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Center Text */}
            <motion.div
              className="text-center px-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-10">
                <svg
                  className="w-20 h-20 mx-auto text-gray-200 dark:text-gray-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="0.5" />
                </svg>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-loose italic font-light">
                "Every brushstroke carries intention. Each color choice reflects
                emotion. The canvas becomes a space where feelings take form and
                silence transforms into beauty."
              </p>

              <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
                <p className="text-[11px] text-gray-400 dark:text-gray-600 tracking-[0.2em] uppercase">
                  Maise
                </p>
              </div>
            </motion.div>

            {/* Right Image - cu ramă */}
            <motion.div
              className="aspect-[2/3] p-2 bg-white dark:bg-gray-900 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-full h-full border-2 border-gray-100 dark:border-gray-800">
                <img
                  src={threeColRightImage}
                  alt={products?.[1]?.title || "painting process"}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. ANOTHER LARGE IMAGE - folosește hero2 dacă există */}
      <section className="relative w-full h-[40vh]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={secondLargeImage}
            alt="abstract painting"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* 6. GALLERY SECTION - produse din config sau fallback la toate produsele */}
      <div className="relative">
        <GallerySection products={galleryData} />
      </div>

      {/* 9. Custom Order CTA */}
      <section className="relative bg-white dark:bg-gray-950 py-24 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            
            className="space-y-8"
          >
            {/* Title */}
            <div className="space-y-3">
              <h2
                className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white leading-tight tracking-tight"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Create Something
              </h2>
              <h2
                className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white leading-tight italic tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                uniquely yours
              </h2>
            </div>

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
              Share your vision, choose your style, and let me create a
              one-of-a-kind masterpiece designed exclusively for you.
            </p>

            {/* Features */}
            <div className="flex justify-center items-center gap-4 text-xs text-gray-400 dark:text-gray-600">
              <span className="tracking-wide">Custom Sizes</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="tracking-wide">Your Colors</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="tracking-wide">Any Theme</span>
            </div>

            {/* Button */}
            <div className="pt-4">
              <Link to="/custom-order">
                <button className="px-10 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-normal tracking-wide hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  Start Your Order
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
