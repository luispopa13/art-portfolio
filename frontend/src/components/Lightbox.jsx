/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({ isOpen, images, initialIndex = 0, onClose }) {
  // Folosim direct initialIndex ca valoare inițială - nu mai facem setState în useEffect
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  // Resetăm indexul doar când se schimbă initialIndex și lightbox-ul este deschis
  // Folosim un ref pentru a evita re-render-urile
  const prevIsOpenRef = useEffect(() => {
    // Când lightbox se închide, pregătim pentru următoarea deschidere
    if (!isOpen && currentIndex !== initialIndex) {
      // Doar pregătim starea, nu o setăm direct în effect
      return;
    }
  }, [isOpen]);

  const next = useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((i) => (i + 1) % images.length);
    setZoom(1);
  }, [images]);

  const prev = useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
  }, [images]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.5, 3)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.5, 1)), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, prev, next, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Resetăm starea când se deschide lightbox-ul (fără setState în effect)
  const effectiveIndex = isOpen ? (currentIndex >= images.length ? 0 : currentIndex) : initialIndex;
  const effectiveZoom = isOpen ? zoom : 1;

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full p-3 transition-all group"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="absolute top-6 left-6 z-50 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              disabled={effectiveZoom >= 3}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full p-3 transition-all disabled:opacity-40"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              disabled={effectiveZoom <= 1}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full p-3 transition-all disabled:opacity-40"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full">
            <span className="text-white font-medium">
              {effectiveIndex + 1} / {images.length}
            </span>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full p-4 transition-all group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 text-white group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full p-4 transition-all group"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          <motion.div
            key={effectiveIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-7xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[effectiveIndex]}
              alt={`Artwork ${effectiveIndex + 1}`}
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain transition-transform duration-300"
              style={{ transform: `scale(${effectiveZoom})` }}
              draggable={false}
            />
          </motion.div>

          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 text-white/50 text-sm">
              Use arrow keys or swipe to navigate
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}