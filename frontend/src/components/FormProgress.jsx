// frontend/src/components/FormProgress.jsx
import { useMemo } from "react";

export default function FormProgress({
  form = {},
  requiredFields = [],
  className = "",
}) {
  const completionPercentage = useMemo(() => {
    if (!requiredFields.length) return 0;

    const filled = requiredFields.filter((field) => {
      const value = form?.[field];

      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "number") return !Number.isNaN(value);
      if (typeof value === "boolean") return value === true;
      if (value === null || value === undefined) return false;

      return value.toString().trim().length > 0;
    }).length;

    return (filled / requiredFields.length) * 100;
  }, [form, requiredFields]);

  const rounded = Math.round(completionPercentage);

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Form Completion
        </span>
        <span className="font-semibold text-purple-600 dark:text-purple-400 transition-colors duration-300">
          {rounded}%
        </span>
      </div>

      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden transition-colors duration-300">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {rounded === 100 && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 transition-colors duration-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          All required fields completed!
        </p>
      )}
    </div>
  );
}
