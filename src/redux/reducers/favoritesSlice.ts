import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { FavoriteItem } from '@/lib/Interfaces';

// Function to load favorites from localStorage
const loadFavoritesFromLocalStorage = () => {
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

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: loadFavoritesFromLocalStorage(),
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      state.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      return state.filter(favorite => favorite.item_uuid !== action.payload);
    },
    
    clearFavorites: () => {
      return [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: AppState) => state.favorites;

export const isFavorite = createSelector(
  [selectFavorites],
  (favorites: FavoriteItem[]) => (itemUuid: string) =>
    favorites.some(favorite => favorite.item_uuid === itemUuid)
);

export default favoritesSlice.reducer;
