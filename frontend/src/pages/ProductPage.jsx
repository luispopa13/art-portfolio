// frontend/src/pages/ProductPage.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useSEO } from "../hooks/useSEO";
import Lightbox from "../components/Lightbox";
import { ZoomIn } from "lucide-react";
import ProductSidebar from "../components/ProductSidebar";
import { fetchProductById } from "../api/products";
import { useProducts } from "../hooks/useProducts";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useProducts(); // pentru recomandări

  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // SEO – se actualizează când se schimbă painting
  useSEO({
    title: painting?.title || "Product",
    description: painting?.description || "View this beautiful artwork",
    image: painting?.image,
  });

  // Load painting doar din backend (Mongo)
  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      setPainting(null);
      setVisible(false);
      setAdded(false);

      // scroll sus când schimbăm produsul
      window.scrollTo(0, 0);

      try {
        const data = await fetchProductById(id);
        if (!active) return;
        setPainting(data);
      } catch (err) {
        console.error("Error loading painting:", err);
        if (active) {
          setError("Painting not found");
          setPainting(null);
        }
      } finally {
        if (active) {
          setLoading(false);
          // mic delay ca să se vadă fade-in
          setTimeout(() => {
            if (active) setVisible(true);
          }, 50);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  // Recomandări – din produsele din backend
  const recommendations = useMemo(() => {
    if (!painting || !products || products.length === 0) return [];

    const currentId = (painting._id || painting.id || "").toString();

    // excludem produsul curent
    const others = products.filter((p) => {
      const pid = (p._id || p.id || "").toString();
      return pid !== currentId;
    });

    if (others.length === 0) return [];

    // încercăm mai întâi aceeași categorie (painting / digital)
    const sameCategory = painting.category
      ? others.filter((p) => p.category === painting.category)
      : [];

    const base = sameCategory.length > 0 ? sameCategory : others;

    // sortare pseudo-random dar deterministă pe baza id-ului produsului
    const seedStr = currentId;
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    }

    const sorted = [...base].sort((a, b) => {
      const aid = (a._id || a.id || "").toString();
      const bid = (b._id || b.id || "").toString();
      const av = (hash(aid, seed) % 1000);
      const bv = (hash(bid, seed) % 1000);
      return av - bv;
    });

    return sorted.slice(0, 3);
  }, [painting, products]);

  // mic helper pentru pseudo-random
  function hash(str, seed) {
    let h = seed || 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 33) ^ str.charCodeAt(i);
    }
    return h >>> 0;
  }

  function handleAddToCart() {
    if (!painting) return;

    const idForCart = painting._id || painting.id;

    addToCart({
      id: idForCart,
      title: painting.title,
      image: painting.image,
      price: painting.price,
      size: painting.size || "",
      soldOut: !!painting.soldOut,
      type: painting.category || painting.type || "painting", // painting/digital
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // stări simple pentru imagine (doar zoom icon + lightbox)
  function handleOpenLightbox() {
    if (!painting?.image) return;
    setLightboxOpen(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-stone-100 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Loading artwork...
          </p>
        </div>
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 via-stone-100 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Oops
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Painting not found."}
          </p>
          <Link to="/shop">
            <button className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition">
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const pageClasses = [
    "min-h-screen",
    "pt-28",
    "pb-20",
    "px-6",
    "bg-gradient-to-br",
    "from-slate-50",
    "via-stone-100",
    "to-amber-50",
    "dark:from-gray-950",
    "dark:via-gray-900",
    "dark:to-gray-950",
    "transition-colors",
    "duration-300",
  ].join(" ");

  const containerClasses = [
    "max-w-6xl",
    "mx-auto",
    "transition-all",
    "duration-500",
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
  ].join(" ");

  return (
    <div className={pageClasses}>
      <div className={containerClasses}>
        {/* BACK LINK */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link to="/shop" className="inline-flex items-center gap-2 group">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow">
              ←
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Back to gallery
            </span>
          </Link>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT — IMAGE + LIGHTBOX */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900/5 dark:bg-white/5 border border-gray-200/60 dark:border-gray-700/60">
              <button
                type="button"
                onClick={handleOpenLightbox}
                className="group block w-full cursor-zoom-in"
              >
                <div className="relative">
                  <img
                    src={painting.image}
                    alt={painting.title}
                    className="w-full h-full max-h-[650px] object-cover select-none"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* overlay gradient bottom */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* zoom icon */}
                  <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 text-white px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                    <ZoomIn className="w-4 h-4" />
                    <span>Click to zoom</span>
                  </div>
                </div>
              </button>
            </div>

            {/* SUBTEXT */}
            {painting.size && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Original artwork · {painting.size}
              </p>
            )}
          </div>

          {/* RIGHT — DETAILS (Sidebar cu share nou) */}
          <div className="space-y-6">
            <ProductSidebar
              painting={painting}
              onAddToCart={handleAddToCart}
              added={added}
            />
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              You may also like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((rec) => {
                const recId = rec._id || rec.id;
                return (
                  <Link
                    key={recId}
                    to={`/product/${recId}`}
                    className="group block bg-white/80 dark:bg-gray-900/80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200/70 dark:border-gray-700/70 transition-all"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg line-clamp-1">
                          {rec.title}
                        </h3>
                        <p className="text-purple-200 text-sm">
                          {rec.price} RON
                          {rec.size ? ` • ${rec.size}` : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxOpen && (
        <Lightbox
          image={painting.image}
          alt={painting.title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
