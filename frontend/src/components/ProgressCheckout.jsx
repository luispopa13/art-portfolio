// frontend/src/components/ProgressCheckout.jsx
import { CheckCircle2, CreditCard, ShoppingBag } from "lucide-react";

const steps = [
  { id: 1, label: "Review Cart", icon: ShoppingBag },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Confirmation", icon: CheckCircle2 },
];

export default function CheckoutProgress({ currentStep = 2 }) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Linie de legătură */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-[2px] -z-10">
                  <div className="h-full w-full bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                    style={{
                      width:
                        currentStep > step.id
                          ? "100%"
                          : currentStep === step.id
                          ? "50%"
                          : "0%",
                    }}
                  />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-3 transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>

              <span
                className={`text-xs md:text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
