import { Lock, CreditCard, ShieldCheck } from "lucide-react";

const colorClasses = {
  green: {
    bg: "bg-green-100 dark:bg-green-900/40",
    text: "text-green-600 dark:text-green-400",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/40",
    text: "text-purple-600 dark:text-purple-400",
  },
};

export default function TrustBadges({ variant = "horizontal" }) {
  const badges = [
    { icon: Lock, text: "SSL Encrypted", color: "green" },
    { icon: CreditCard, text: "Secure Payment", color: "blue" },
    { icon: ShieldCheck, text: "PCI Compliant", color: "purple" },
  ];

  if (variant === "vertical") {
    return (
      <div className="space-y-3">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          const c = colorClasses[badge.color];
          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
              >
                <Icon className={`w-5 h-5 ${c.text}`} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                {badge.text}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-3">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        const c = colorClasses[badge.color];
        return (
          <div key={index} className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${c.text}`} />
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {badge.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
