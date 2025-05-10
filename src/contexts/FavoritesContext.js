import React, { createContext, useState, useEffect, useCallback } from "react";

export const FavoritesContext = createContext({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage on initial load
    try {
      const localData = localStorage.getItem("favoriteMovies");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
    } catch (error) {
      console.error(
        "Error stringifying or saving favorites to localStorage:",
        error
      );
    }
  }, [favorites]);

  const addFavorite = useCallback((movie) => {
    setFavorites((prevFavorites) => {
      // Prevent adding duplicates
      if (!prevFavorites.find((fav) => fav.id === movie.id)) {
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  }, []);

  const removeFavorite = useCallback((movieId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== movieId)
    );
  }, []);

  const isFavorite = useCallback(
    (movieId) => {
      return !!favorites.find((movie) => movie.id === movieId);
    },
    [favorites]
  );

  const contextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
