import { BASE_URL } from '@/lib/Common';
import { setBusinessData } from './reducers/businessSlice';
import { setCollectionData } from './reducers/collectionSlice';
import { setProductsData, setProductData } from './reducers/productSlice';

export const FETCH_DATA = 'FETCH_DATA';
export const FETCH_DATA_PRODUCTS = 'FETCH_DATA_PRODUCTS';

export const fetchData = () => async (dispatch: any) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/public/business`);
    const data = await response.json();
    console.log('business Data is', data);
    dispatch(setBusinessData(data.data));
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

export const fetchDataProducts =
  (id: number = 1) =>
  async (dispatch, getState) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/public/items?page=${id}`);
      const data = await response.json();
      dispatch(
        setProductsData({
          data: data.data,
          currentPage: data.currentPage,
          totalRecords: data.totalRecords,
        })
      );
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

export const fetchDataProduct = (uuid: string) => async dispatch => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/public/items/${uuid}`);
    const data = await response.json();
    dispatch(setProductData(data.data));
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

export const fetchRecommendationProducts = (collection: string) => async (dispatch, getState) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/public/items?collection=${collection}`);
    const data = await response.json();
    dispatch(
      setProductsData({
        data: data.data,
        currentPage: 1,
        totalRecords: data.data.length,
      })
    );
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

export const fetchDataCollection = () => async dispatch => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/public/collections`);
    const data = await response.json();
    console.log('collection Data is', data);
    dispatch(setCollectionData(data.collections));
  } catch (error) {
    console.error('Error fetching data', error);
  }
};
