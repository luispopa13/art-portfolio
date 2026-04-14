import { ShieldCheck, Lock, CreditCard } from 'lucide-react';

export default function SecurityBanner() {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          Your Purchase is Protected
        </h3>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">PCI Compliant</span>
        </div>
      </div>
    </div>
  );
}