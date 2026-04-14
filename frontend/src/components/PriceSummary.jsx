import { Lock } from 'lucide-react';

export default function PriceSummary({ 
  totalPrice, 
  onCheckout, 
  loading = false,
  buttonText = "Proceed to Payment" 
}) {
  return (
    <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
        Price Details
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <span>Subtotal</span>
          <span className="font-medium">{totalPrice} RON</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <span>Shipping</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            Calculated at checkout
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <span>Tax</span>
          <span className="font-medium">Included</span>
        </div>
      </div>

      <div className="pt-4 mb-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Total
          </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            {totalPrice} RON
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            {buttonText}
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <Lock className="w-3 h-3" />
        <span>Powered by Stripe</span>
      </div>
    </div>
  );
}