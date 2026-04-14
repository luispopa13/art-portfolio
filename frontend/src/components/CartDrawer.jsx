import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[99998]"
          onClick={onClose}
        ></div>
      )}

      {/* DRAWER */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 
          bg-white dark:bg-gray-900 dark:text-gray-100 
          shadow-2xl border-l border-gray-200 dark:border-gray-800
          z-[99999] 
          transform transition-all duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 text-2xl hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300"
          >
            &times;
          </button>
        </div>

        {/* ITEMS */}
        <div className="p-6 overflow-y-auto h-[calc(100%-180px)] space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
                Your cart is empty
              </p>
              <Link to="/shop" onClick={onClose}>
                <button className="px-6 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-300">
                  Browse Paintings
                </button>
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border border-gray-200 dark:border-gray-800 p-3 rounded-lg transition-colors duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                />

                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white transition-colors duration-300">
                    {item.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    {item.price} RON
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300"
                    >
                      −
                    </button>

                    <span className="font-medium text-sm text-gray-900 dark:text-white transition-colors duration-300">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-lg transition-colors duration-300"
                  title="Remove from cart"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
          {cart.length > 0 && (
            <div className="mb-3 flex justify-between text-lg font-semibold">
              <span className="text-gray-900 dark:text-white transition-colors duration-300">
                Total:
              </span>
              <span className="text-purple-600 dark:text-purple-400 transition-colors duration-300">
                {totalPrice} RON
              </span>
            </div>
          )}

          <Link to="/checkout" onClick={onClose}>
            <button
              disabled={cart.length === 0}
              className="w-full py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {cart.length === 0 ? "Cart is Empty" : "Go to Checkout"}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
