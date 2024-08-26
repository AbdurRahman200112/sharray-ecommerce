import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { CartItem } from '@/lib/Interfaces';

const loadCartFromLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      console.log('Loaded cart from local storage:', cart);
      return cart;
    }
  } catch (error) {
    console.error('Could not load cart from local storage:', error);
  }
  return [];
};

// Save cart to local storage
const saveCartToLocalStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Could not save cart to local storage:', error);
  }
};


export const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromLocalStorage(),
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.find(item => item.uuid === action.payload.uuid);
      if (existingItem) {
        existingItem.quan += 1;
      } else {
        state.push({ ...action.payload, quan: 1 });
      }
      saveCartToLocalStorage(state); // Save to local storage
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const newState = state.filter(item => item.item_uuid !== action.payload);
      saveCartToLocalStorage(newState); // Save to local storage
      return newState;
    },
    incrementItemQuantity: (state, action: PayloadAction<string>) => {
      const item = state.find(item => item.uuid === action.payload);
      if (item) {
        item.quan += 1;
        saveCartToLocalStorage(state); 
      }
    },
    updateCartItem: (
      state,
      action: PayloadAction<{ uuid: string; updates: Partial<CartItem> }>
    ) => {
      const index = state.findIndex(item => item.uuid === action.payload.uuid);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload.updates };
        saveCartToLocalStorage(state); // Save to local storage
      }
    },
    decrementItemQuantity: (state, action: PayloadAction<string>) => {
      const item = state.find(item => item.uuid === action.payload);
      if (item) {
        if (item.quan > 1) {
          item.quan -= 1;
        } else {
          return state.filter(item => item.uuid !== action.payload);
        }
        saveCartToLocalStorage(state); // Save to local storage
      }
    },
    clearCart: () => {
      return [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementItemQuantity,
  decrementItemQuantity,
  clearCart,
  updateCartItem,
} = cartSlice.actions;

export const selectCart = (state: AppState) => state.cart;

export const selectCartTotal = createSelector([selectCart], cartItems => {
  return cartItems.reduce((total, item) => total + item.price * item.quan, 0);
});

export const isProductCart = createSelector(
  [selectCart],
  (cartItems: CartItem[]) => (itemUuid: string) => {
    return cartItems.some(item => item.uuid === itemUuid);
  }
);

export const selectCartNotes = createSelector(
  [selectCart],
  (cartItems: CartItem[]) => (itemUuid: string) => {
    const foundItem = cartItems.find(item => item.uuid === itemUuid);
    return foundItem ? foundItem.notes : '';
  }
);

export const selectTotalItemCount = createSelector([selectCart], cartItems => {
  return cartItems.reduce((totalItemCount, item) => totalItemCount + item.quan, 0);
});

export default cartSlice.reducer;
