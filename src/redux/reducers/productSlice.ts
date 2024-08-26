import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState, AppThunk } from '../store';
import { fetchDataProducts } from '../dataActions';
import { Product } from '@/lib/Interfaces';

export const ProductSlice = createSlice({
  name: 'products',
  initialState: {
    products: [] as Product[],
    product: null as Product,
    currentPage: 1,
    totalRecords: 0,
  },
  reducers: {
    setProductsData: (state, action) => {
      const { data, currentPage, totalRecords } = action.payload;
      console.log('data', data);
      state.products = data;
      state.currentPage = currentPage;
      state.totalRecords = totalRecords;
    },
    setNewData: (state, action) => {
      const { data, currentPage } = action.payload;

      console.log('data', data);
      console.log('STATE_products', state);

      state.products = [...state.products, ...data];
      state.currentPage = currentPage;
    },
    setProductData: (state, action) => {
      state.product = action.payload;
      console.log('PRODUCTS', state.product);
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log('PRODUCTS_HYDRATE', action.payload);
      console.log('PRODUCTS_SSR_STATE', action.payload.products);
      return (state = {
        ...state,
        ...action.payload.products,
      });
    },
  },
});

export const { setProductsData, setNewData, setProductData } = ProductSlice.actions;
export const selectProducts = (state: AppState) => state.products.products;
export const selectProduct = (state: AppState) => state.products.product;
export const selectCurrentPage = (state: AppState) => state.products.currentPage;
export const selectTotalRecords = (state: AppState) => state.products.totalRecords;

export const fetchProduct = (): AppThunk => async dispatch => {
  await dispatch(fetchDataProducts());
};

export default ProductSlice.reducer;
