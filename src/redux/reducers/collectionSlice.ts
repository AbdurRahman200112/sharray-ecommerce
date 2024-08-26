import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState, AppThunk } from '../store';
import { fetchDataCollection } from '../dataActions';
import { Collection } from '@/lib/Interfaces';

export const CollectionSlice = createSlice({
  name: 'collection',
  initialState: {
    collections: [] as Collection[],
  },
  reducers: {
    setCollectionData: (state, action) => {
      state.collections = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log('COLLECTION_HYDRATE', action.payload.collection);
      return (state = {
        ...state,
        ...action.payload.collection,
      });
    },
  },
});

export const { setCollectionData } = CollectionSlice.actions;
export const selectCollection = (state: AppState) => state.collection;
export const fetchCollections = (): AppThunk => async dispatch => {
  await dispatch(fetchDataCollection());
};

export default CollectionSlice.reducer;
