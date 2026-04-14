import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { FavoritesProvider } from "./context/FavoritesContext";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const CustomOrderPage = lazy(() => import("./pages/CustomOrderPage"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Success = lazy(() => import("./pages/Success"));
const Cancel = lazy(() => import("./pages/Cancel"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const FavoritesPage = lazy(() => import("./pages/Favorites"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DigitalPrints = lazy(() => import("./pages/DigitalPrints")); // NEW

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 dark:bg-gray-950 transition-colors duration-300">
              <Navbar />
              <ScrollToTop />
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-xl text-gray-700 dark:text-gray-300">
                        Loading...
                      </p>
                    </div>
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/custom-order"
                    element={<CustomOrderPage />}
                  />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/cancel" element={<Cancel />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route
                    path="/digital-prints"
                    element={<DigitalPrints />}
                  />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />

                  {/* Admin */}
                  <Route path="/admin" element={<AdminProducts />} />
                  <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              <Footer />
            </div>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
