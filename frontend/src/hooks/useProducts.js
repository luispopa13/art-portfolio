// frontend/src/hooks/useProducts.js
import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";

/**
 * Hook generic pentru produse.
 * category poate fi:
 *  - "painting"
 *  - "digital"
 *  - undefined (toate)
 */
export function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts(category);
        if (!active) return;

        // Normalizăm category ca să nu fie undefined pentru produsele vechi
        const normalized = (data || []).map((p) => ({
          ...p,
          category: p.category || "painting",
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("Failed to load products", err);
        if (active) setError("Failed to load products");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [category]);

  return { products, loading, error, setProducts };
}
