import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState, AppThunk } from '../store';
import { fetchData } from '../dataActions';
import { Business } from '@/lib/Interfaces';

const initialBusinessState: Business = {
  buid: '',
  title_ar: '',
  title_en: '',
  email: '',
  phone: '',
  address: '',
  descr_ar: '',
  descr_en: '',
  instructions: '',
  mainColor: '',
  secColor: '',
  textColor: '',
  logo: '',
};

export const BusinessSlice = createSlice({
  name: 'business',
  initialState: initialBusinessState,
  reducers: {
    setBusinessData: (state, action) => {
      state.buid = action.payload.buid;
      state.title_ar = action.payload.title_ar;
      state.title_en = action.payload.title_en;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.address = action.payload.address;
      state.descr_ar = action.payload.descr_ar;
      state.descr_en = action.payload.descr_en;
      state.instructions = action.payload.instructions;
      state.mainColor = action.payload.main_color;
      state.secColor = action.payload.sec_color;
      state.textColor = action.payload.text_color;
      state.logo = action.payload.logo;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log('BUSINESS_HYDRATE', action.payload.business);
      return (state = {
        ...state,
        ...action.payload.business,
      });
    },
  },
});

export const { setBusinessData } = BusinessSlice.actions;
export const selectBusiness = (state: AppState) => state.business;
export const fetchBusiness = (): AppThunk => async dispatch => {
  await dispatch(fetchData());
};

export default BusinessSlice.reducer;
