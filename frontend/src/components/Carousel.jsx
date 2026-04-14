/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";

export default function Carousel({ products = [], loading, error }) {
  /**
   * slides:
   * - dacă avem products cu `image` -> le folosim
   * - altfel fallback p1..p4 (portrait default)
   */
  const slides = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      const withImage = products.filter((p) => p && p.image);
      if (withImage.length > 0) {
        return withImage.map((p, idx) => ({
          src: p.image,
          alt: p.title || `Artwork ${idx + 1}`,
          orientation: p.orientation === "landscape" ? "landscape" : "portrait",
        }));
      }
    }

    return [
      { src: p1, alt: "Artwork 1", orientation: "portrait" },
      { src: p2, alt: "Artwork 2", orientation: "portrait" },
      { src: p3, alt: "Artwork 3", orientation: "portrait" },
      { src: p4, alt: "Artwork 4", orientation: "portrait" },
    ];
  }, [products]);

  const [index, setIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const next = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setIndex((i) => (i + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const prev = useCallback(() => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const goToSlide = useCallback(
    (i) => {
      if (isTransitioning || i === index || slides.length === 0) return;
      setIsTransitioning(true);
      setIndex(i);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning, index, slides.length]
  );

  useEffect(() => {
    if (!isAutoplay || slides.length === 0) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isAutoplay, next, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  const getPosition = (i) => {
    const diff = i - index;
    if (diff === 0)
      return { x: 0, z: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 50 };
    if (diff === 1 || diff === -(slides.length - 1))
      return { x: 380, z: -300, rotateY: -45, scale: 0.75, opacity: 0.6, zIndex: 30 };
    if (diff === -1 || diff === slides.length - 1)
      return { x: -380, z: -300, rotateY: 45, scale: 0.75, opacity: 0.6, zIndex: 30 };
    if (diff === 2 || diff === -(slides.length - 2))
      return { x: 680, z: -500, rotateY: -60, scale: 0.5, opacity: 0.3, zIndex: 10 };
    return { x: -680, z: -500, rotateY: 60, scale: 0.5, opacity: 0.3, zIndex: 10 };
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-20 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="relative w-full max-w-7xl mx-auto px-6 z-10">
        {/* TITLE */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-light mb-3 tracking-wide">
            <span className="text-gray-800 dark:text-gray-100 transition-colors">
              Gallery
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-light transition-colors">
            Swipe through my artwork collection
          </p>
        </motion.div>

        {/* COVERFLOW */}
        <div className="relative h-[600px] mb-12" style={{ perspective: "2000px" }}>
          {slides.map((slide, i) => {
            const pos = getPosition(i);

            // ✅ per-slide orientation
            const isLandscape = slide.orientation === "landscape";
            const frameAspect = isLandscape ? "aspect-[3/2]" : "aspect-[4/5]";
            const frameWidth = isLandscape ? "w-[520px] md:w-[560px]" : "w-[380px] md:w-[420px]";

            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  x: `calc(-50% + ${pos.x}px)`,
                  y: "-50%",
                  z: pos.z,
                  rotateY: pos.rotateY,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                onClick={() => i !== index && goToSlide(i)}
              >
                {/* Frame wrapper */}
                <div className={`${frameWidth} p-2 bg-white dark:bg-gray-900 shadow-xl transition-colors`}>
                  <div className={`w-full ${frameAspect} border-2 border-gray-100 dark:border-gray-800 overflow-hidden`}>
                    <img
                      src={slide.src}
                      alt={slide.alt || `Artwork ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {i === index && (
                    <div className="absolute inset-0 ring-1 ring-gray-800 dark:ring-gray-200 pointer-events-none transition-colors" />
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* NAV */}
          <motion.button
            onClick={prev}
            disabled={isTransitioning}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center z-[100] disabled:opacity-40 transition-colors border border-gray-200 dark:border-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-gray-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={next}
            disabled={isTransitioning}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center z-[100] disabled:opacity-40 transition-colors border border-gray-200 dark:border-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-gray-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-center gap-8">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goToSlide(i)}
                disabled={isTransitioning}
                className="relative"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Slide ${i + 1}`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "bg-gray-800 dark:bg-gray-100 w-8" : "bg-gray-300 dark:bg-gray-700 w-1.5"
                  }`}
                />
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="px-5 py-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-md flex items-center gap-2.5 transition-colors border border-gray-200 dark:border-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle autoplay"
          >
            {isAutoplay ? (
              <>
                <div className="flex gap-0.5">
                  <motion.div
                    className="w-0.5 h-3.5 bg-gray-800 dark:bg-gray-100 rounded-full transition-colors"
                    animate={{ scaleY: [1, 0.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-0.5 h-3.5 bg-gray-800 dark:bg-gray-100 rounded-full transition-colors"
                    animate={{ scaleY: [1, 0.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                  />
                </div>
                <span className="text-xs font-normal text-gray-700 dark:text-gray-300 transition-colors">
                  Pause
                </span>
              </>
            ) : (
              <>
                <div className="w-0 h-0 border-l-[8px] border-l-gray-800 dark:border-l-gray-100 border-y-[5px] border-y-transparent transition-colors" />
                <span className="text-xs font-normal text-gray-700 dark:text-gray-300 transition-colors">
                  Play
                </span>
              </>
            )}
          </motion.button>

          <div className="px-5 py-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-md transition-colors border border-gray-200 dark:border-gray-800">
            <span className="text-lg font-normal text-gray-800 dark:text-gray-100 transition-colors">
              {index + 1}
            </span>
            <span className="text-gray-400 dark:text-gray-600 mx-1.5 transition-colors">/</span>
            <span className="text-gray-500 dark:text-gray-400 font-normal transition-colors">
              {slides.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
