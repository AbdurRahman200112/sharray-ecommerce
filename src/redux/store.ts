/* ----------------------------------- -- ----------------------------------- */
import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { Action } from 'redux';

import rootReducer from './reducers/rootReducer';
/* ----------------------------------- -- ----------------------------------- */

const saveState = state => {
  try {
    const serialisedState = JSON.stringify(state.cart);
    const serialisedFavoriteState = JSON.stringify(state.favorites);
    localStorage.setItem('cart', serialisedState);
    localStorage.setItem('favorites', serialisedFavoriteState);
  } catch (e) {
    console.warn('Unable to save state to local storage:', e);
  }
};

const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: true,
  });

  // Save the state to local storage whenever it changes
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);
