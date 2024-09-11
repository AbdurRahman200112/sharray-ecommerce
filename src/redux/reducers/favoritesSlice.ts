import { FavoriteItem } from '@/lib/Interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';

// Load favorites from local storage
// Load favorites from local storage
const loadFavoritesFromLocalStorage = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return []; // Return empty array if on the server
  try {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      return JSON.parse(storedFavorites);
    }
  } catch (error) {
    console.error('Could not load favorites from local storage:', error);
  }
  return [];
};

// Save favorites to local storage
const saveFavoritesToLocalStorage = (favorites: FavoriteItem[]) => {
  if (typeof window === 'undefined') return; // Do nothing if on the server
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Could not save favorites to local storage:', error);
  }
};


const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: loadFavoritesFromLocalStorage(),
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const existingFavoriteIndex = state.findIndex(favorite => favorite.uuid === action.payload.uuid);
      if (existingFavoriteIndex === -1) {
        state.push(action.payload);
        saveFavoritesToLocalStorage(state);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      const updatedFavorites = state.filter(favorite => favorite.uuid !== action.payload);
      saveFavoritesToLocalStorage(updatedFavorites);
      return updatedFavorites;
    },
    clearFavorites: () => {
      saveFavoritesToLocalStorage([]); // Save empty array to local storage
      return [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: AppState) => state.favorites;

export default favoritesSlice.reducer;
