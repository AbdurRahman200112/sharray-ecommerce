import { combineReducers } from 'redux';
import businessSlice from './businessSlice';
import productSlice from './productSlice';
import collectionSlice from './collectionSlice';
import cartSlice from './cartSlice';
import favoritesSlice from './favoritesSlice';

const rootReducer = combineReducers({
  business: businessSlice,
  products: productSlice,
  collection: collectionSlice,
  cart: cartSlice,
  favorites: favoritesSlice,
});

export default rootReducer;
