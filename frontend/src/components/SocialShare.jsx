/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Share2, Facebook, Instagram, MessageCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Icon link simplu
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

export default function SocialShare({ title, image, url }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");

  // Folosim URL-ul curent dacă nu e specificat
  const shareUrl = url || window.location.href;
  const shareText = `Check out this artwork: ${title}`;

  // Facebook
  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  // WhatsApp
  const shareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.open(waUrl, "_blank");
  };

  // Pinterest
  const sharePinterest = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      shareUrl
    )}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(
      title
    )}`;
    window.open(pinterestUrl, "_blank", "width=750,height=550");
  };

  // Twitter/X
  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  // Instagram – doar instrucțiuni
  const shareInstagram = () => {
    setCurrentPlatform("Instagram");
    setShowInstructions(true);
    setShowMenu(false);
  };

  // TikTok – doar instrucțiuni
  const shareTikTok = () => {
    setCurrentPlatform("TikTok");
    setShowInstructions(true);
    setShowMenu(false);
  };

  // Copy Link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // butonul principal: încearcă native share + deschide/închide meniul nostru
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
    // IMPORTANT: menținem și dropdown-ul nostru
    setShowMenu((prev) => !prev);
  };

  const shareButtons = [
    {
      name: "Facebook",
      icon: Facebook,
      onClick: shareFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      ariaLabel: "Share on Facebook",
      directShare: true,
    },
    {
      name: "Instagram",
      icon: Instagram,
      onClick: shareInstagram,
      color:
        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      ariaLabel: "Share on Instagram (instructions)",
      directShare: false,
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      onClick: shareTikTok,
      color: "bg-black hover:bg-gray-900",
      ariaLabel: "Share on TikTok (instructions)",
      directShare: false,
    },
    {
      name: "Pinterest",
      icon: PinterestIcon,
      onClick: sharePinterest,
      color: "bg-red-600 hover:bg-red-700",
      ariaLabel: "Share on Pinterest",
      directShare: true,
    },
    {
      name: "Twitter/X",
      icon: TwitterIcon,
      onClick: shareTwitter,
      color: "bg-gray-900 hover:bg-black",
      ariaLabel: "Share on Twitter/X",
      directShare: true,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      onClick: shareWhatsApp,
      color: "bg-green-600 hover:bg-green-700",
      ariaLabel: "Share on WhatsApp",
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
          "💡 Instagram doesn't allow direct web sharing due to their API restrictions",
          "📱 Best results: Use Instagram mobile app",
          "🔗 Copy the link below to share in your bio or DMs",
        ],
      };
    } else if (currentPlatform === "TikTok") {
      return {
        title: "Share on TikTok",
        steps: [
          "Take a screenshot or screen recording of this artwork",
          "Open TikTok app on your phone",
          "Tap the '+' button to create",
          "Upload your screenshot/recording",
          "Add creative effects and music",
          "Mention @artbymisa in caption",
          "Add the link in your bio or comments",
        ],
        tips: [
          "💡 TikTok doesn't support direct web sharing",
          "🎵 Add trending music for better reach",
          "🔗 Copy the link below to share in comments",
        ],
      };
    }
    return { title: "", steps: [], tips: [] };
  };

  const instructions = getInstructions();

  return (
    <div className="relative">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-gray-700">Share:</span>

        {/* Main Share Button */}
        <motion.button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share this artwork"
          aria-expanded={showMenu}
          aria-haspopup="true"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          Share
        </motion.button>

        {/* Copy Link Button */}
        <motion.button
          onClick={copyLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-md transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={copied ? "Link copied!" : "Copy link to artwork"}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <LinkIconSVG />
              Copy Link
            </>
          )}
        </motion.button>
      </div>

      {/* Share Menu Dropdown – acum DESCHIS ÎN SUS și cu z-index mare */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[90] min-w-[300px]"
            role="menu"
            aria-label="Share options"
          >
            <div className="space-y-2">
              {shareButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <motion.button
                    key={btn.name}
                    onClick={() => {
                      btn.onClick();
                      if (btn.directShare) {
                        setShowMenu(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-white font-medium transition-all ${btn.color}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    role="menuitem"
                    aria-label={btn.ariaLabel}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      {btn.name}
                    </div>
                    {!btn.directShare && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">
                        Guide
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={() => setShowMenu(false)}
              className="w-full mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500 hover:text-gray-700 transition"
              aria-label="Close share menu"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Modal */}
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
                        {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Copy Link Button */}
              <motion.button
                onClick={() => {
                  copyLink();
                  setTimeout(() => setShowInstructions(false), 1500);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <LinkIconSVG />
                    Copy Link to Share
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
