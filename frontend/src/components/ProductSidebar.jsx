/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";

// icon mic pt. link
const LinkIconSVG = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

// Pinterest, TikTok, Twitter icon SVG custom
const PinterestIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function ProductSidebar({
  painting,
  onAddToCart,
  added,
  soldOut,
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

  // suportă și Mongo (_id) și static (id)
  const paintingId = painting._id || painting.id;
  const favorite = isFavorite(paintingId);

  // 👇 sursa unică de adevăr pentru sold out în UI
  const isSoldOut = soldOut ?? !!painting.soldOut;

  const [showMenu, setShowMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this artwork: ${painting.title}`;

  const handleToggleFavorite = () => {
    const paintingData = {
      id: paintingId,
      image: painting.image,
      title: painting.title,
      price: painting.price,
      size: painting.size || "",
      soldOut: isSoldOut,
    };
    toggleFavorite(paintingData);
  };

  // copy link (folosit de butonul "+")
  async function handleCopyLink() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const el = document.createElement("textarea");
        el.value = shareUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  // share handlers
  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  const shareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.open(waUrl, "_blank");
  };

  const sharePinterest = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      shareUrl
    )}&media=${encodeURIComponent(
      painting.image
    )}&description=${encodeURIComponent(painting.title)}`;
    window.open(pinterestUrl, "_blank", "width=750,height=550");
  };

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareInstagram = () => {
    setCurrentPlatform("Instagram");
    setShowInstructions(true);
    setShowMenu(false);
  };

  const shareTikTok = () => {
    setCurrentPlatform("TikTok");
    setShowInstructions(true);
    setShowMenu(false);
  };

  const shareButtons = [
    {
      name: "Facebook",
      icon: Facebook,
      onClick: shareFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      directShare: true,
    },
    {
      name: "Instagram",
      icon: Instagram,
      onClick: shareInstagram,
      color:
        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      directShare: false,
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      onClick: shareTikTok,
      color: "bg-black hover:bg-gray-900",
      directShare: false,
    },
    {
      name: "Pinterest",
      icon: PinterestIcon,
      onClick: sharePinterest,
      color: "bg-red-600 hover:bg-red-700",
      directShare: true,
    },
    {
      name: "Twitter/X",
      icon: TwitterIcon,
      onClick: shareTwitter,
      color: "bg-gray-900 hover:bg-black",
      directShare: true,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      onClick: shareWhatsApp,
      color: "bg-green-600 hover:bg-green-700",
      directShare: true,
    },
  ];

  const getInstructions = () => {
    if (currentPlatform === "Instagram") {
      return {
        title: "Share on Instagram",
        steps: [
          "Take a screenshot of this artwork or save the image",
          "Open Instagram app on your phone",
          "Create a new post or story",
          "Upload the screenshot/image",
          "Tag @artbymisa (or your Instagram handle)",
          "Add the link in your bio or share via DM",
        ],
        tips: [
          "💡 Instagram doesn't allow direct web sharing from websites",
          "📱 Best results: use the Instagram mobile app",
          "🔗 Copy the link below to share in your bio or DMs",
        ],
      };
    }
    if (currentPlatform === "TikTok") {
      return {
        title: "Share on TikTok",
        steps: [
          "Take a screenshot or screen recording of this artwork",
          "Open TikTok app on your phone",
          "Tap the '+' button to create a new video",
          "Upload your screenshot/recording",
          "Add effects and music",
          "Mention @artbymisa in caption",
          "Add the link in your bio or comments",
        ],
        tips: [
          "💡 TikTok doesn't support direct web share",
          "🎵 Use trending music for better reach",
          "🔗 Copy the link below to put it in comments or bio",
        ],
      };
    }
    return { title: "", steps: [], tips: [] };
  };

  const instructions = getInstructions();

  return (
    <div className="space-y-6">
      {/* Price Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">
              Price
            </p>
            <p
              className={`text-4xl font-bold transition-colors duration-300 ${
                isSoldOut
                  ? "text-gray-400 dark:text-gray-600 line-through"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
              }`}
            >
              {painting.price} RON
            </p>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`p-3 rounded-full transition-all duration-300 ${
              favorite
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600"
            }`}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-5 h-5 ${favorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {isSoldOut && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-300">
            <p className="text-red-700 dark:text-red-400 text-sm font-semibold transition-colors duration-300">
              ⚠️ This artwork has been sold
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onAddToCart}
            disabled={isSoldOut}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
              isSoldOut
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSoldOut ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sold Out
              </>
            ) : added ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>

          {/* Share + Copy link row */}
          <div className="w-full flex items-center gap-2 relative">
            {/* SHARE BUTTON – deschide meniul cu platforme */}
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-300 flex items-center justify-center gap-2 text-sm bg-white dark:bg-gray-900"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {/* BUTON MIC + care copiază linkul */}
            <motion.button
              type="button"
              onClick={handleCopyLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all ${
                linkCopied
                  ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
              aria-label="Copy link"
            >
              {linkCopied ? <Check className="w-4 h-4" /> : <LinkIconSVG />}
            </motion.button>

            {/* DROPDOWN SHARE – se deschide în SUS, peste footer (z-index mare) */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[90] min-w-[260px]"
                >
                  <div className="space-y-2">
                    {shareButtons.map((btn) => {
                      const Icon = btn.icon;
                      return (
                        <motion.button
                          key={btn.name}
                          type="button"
                          onClick={() => {
                            btn.onClick();
                            if (btn.directShare) {
                              setShowMenu(false);
                            }
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all ${btn.color}`}
                          whileHover={{ scale: 1.02, x: 3 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            {btn.name}
                          </span>
                          {!btn.directShare && (
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">
                              Guide
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMenu(false)}
                    className="w-full mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500 hover:text-gray-700 transition"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 space-y-4 border border-purple-100 dark:border-purple-800 transition-colors duration-300">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          Why Buy From Us
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm transition-colors duration-300">
                Secure Payment
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Protected by Stripe
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm transition-colors duration-300">
                Careful Shipping
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Insured & tracked delivery
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm transition-colors duration-300">
                Original Artwork
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Certificate of authenticity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Specs */}
      {painting.size && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Specifications
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Size
              </span>
              <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                {painting.size}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Medium
              </span>
              <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                Acrylic on Canvas
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Year
              </span>
              <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                2025
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Frame
              </span>
              <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                Unframed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overlay click to close dropdown */}
      {showMenu && (
        <div
          className="fixed inset-0 z-[80]"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Modal Instrucțiuni Instagram / TikTok */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {instructions.title}
                </h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close instructions"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  How to Share:
                </h4>
                <ol className="space-y-3">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {instructions.tips.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-semibold text-purple-900 mb-2">
                    💡 Tips:
                  </h4>
                  <ul className="space-y-2">
                    {instructions.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-purple-800">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Copy link din modal */}
              <motion.button
                type="button"
                onClick={async () => {
                  await handleCopyLink();
                  setTimeout(() => setShowInstructions(false), 1500);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  linkCopied
                    ? "bg-green-600 text-white"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Link copied!
                  </>
                ) : (
                  <>
                    <LinkIconSVG />
                    Copy link to share
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
