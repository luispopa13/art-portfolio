/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  // Citim o singură dată din localStorage, sincron
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = window.localStorage.getItem("favorites");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Error reading favorites from localStorage:", err);
      return [];
    }
  });

  // Salvăm ori de câte ori se schimbă
  useEffect(() => {
    try {
      window.localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (err) {
      console.error("Error saving favorites to localStorage:", err);
    }
  }, [favorites]);

  function toggleFavorite(painting) {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === painting.id);

      if (exists) {
        // remove
        return prev.filter((fav) => fav.id !== painting.id);
      }

      // add
      return [
        ...prev,
        {
          id: painting.id,
          image: painting.image,
          title: painting.title,
          price: painting.price,
          size: painting.size || "",
          soldOut: painting.soldOut || false,
        },
      ];
    });
  }

  function isFavorite(id) {
    return favorites.some((fav) => fav.id === id);
  }

  function clearFavorites() {
    setFavorites([]);
  }

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
