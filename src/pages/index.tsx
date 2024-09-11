import { Loader } from '@/components/Common/Loader';
import { Price } from '@/components/Common/Price';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Card from '@/components/Product/Card';
import { BASE_URL } from '@/lib/Common';
import { Business, CollectionItem, Product } from '@/lib/Interfaces';
import { useTranslation } from '@/localization/index';
import { fetchDataCollection, fetchDataProducts } from '@/redux/dataActions';
import businessSlice, { fetchBusiness, selectBusiness } from '@/redux/reducers/businessSlice';
import { selectCartTotal } from '@/redux/reducers/cartSlice';
import { selectCollection } from '@/redux/reducers/collectionSlice';
import {
  selectCurrentPage,
  selectProducts,
  selectTotalRecords,
  setProductsData,
} from '@/redux/reducers/productSlice';
import { AppState, wrapper } from '@/redux/store';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { SwiperSlide } from 'swiper/react';

const DynamicCollection = dynamic(() => import('@/components/Swiper/Collection'), {
  ssr: false,
});

const Home: NextPage = ({ business, products }: { business: Business; products: Product[] }) => {
  const { t, currentLanguage } = useTranslation();
  const bs = useSelector(selectBusiness);
  const pd = useSelector(selectProducts);
  const cr = useSelector(selectCurrentPage);
  const ta = useSelector(selectTotalRecords);
  const co = useSelector(selectCollection);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  const bottomBoundaryRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const businessState = useSelector(selectBusiness);
  const [loading, setLoading] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState('All');
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    loadCollection('All', 12); 
    return () => setLoading(false);
  }, []);

  const isBottomVisible = useCallback((element: HTMLDivElement | null) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }, []);

  // Remove loadMore function, automatically loading on scroll
  const loadCollection = async (collectionName: string, limit: number) => {
    setLoading(true);
    setSelectedCollections(collectionName);

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/public/items?limit=25${
          collectionName !== 'All' ? `&collection=${collectionName}` : ''
        }`
      );
      const data = await response.json();
      console.log('API response:', data);

      if (data && data.data && Array.isArray(data.data.items)) {
        const products: Product[] = data.data.items;
        setAllProducts(products);
        setVisibleProducts(products.slice(0, 12)); 
        
        dispatch(
          setProductsData({
            data: products,
            currentPage: data.currentPage,
            totalRecords: data.totalRecords,
          })
        );
      } else {
        console.error('Unexpected API response structure:', data);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      if (loading || allProducts.length <= visibleProducts.length) return;

      if (bottomBoundaryRef.current && isBottomVisible(bottomBoundaryRef.current)) {
        setLoading(true);
        setTimeout(() => {
          const newVisibleProducts = allProducts.slice(visibleProducts.length, visibleProducts.length + 12);
          setVisibleProducts(prevProducts => [...prevProducts, ...newVisibleProducts]);
          setLoading(false);
        }, 1000); // Simulate loading delay
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, isBottomVisible, visibleProducts, allProducts]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>{currentLanguage === 'ar' ? bs?.title_ar : bs?.title_en}</title>
        <meta
          property="og:description"
          content={currentLanguage === 'ar' ? bs?.descr_ar : bs?.descr_en}
          key="title"
        />
        <meta name="keywords" content={co.collections.map(coll => coll.collection).join(', ')} />
      </Head>
      <div className="flex flex-col gap-5">
        <div className="my-6">
          <h1 className="text-2xl font-bold">
            {t('greet')}
            {currentLanguage === 'ar' ? business.title_ar : business.title_en}
          </h1>
          <p>{currentLanguage === 'ar' ? business.descr_ar : business.descr_en}</p>
        </div>

        <div
          key={currentLanguage}
          style={{
            backgroundColor: business.textColor,
          }}
          className="h-10 border-[0.8px] items-center flex rounded-full px-2"
        >
          <DynamicCollection>
            <SwiperSlide
              onClick={() => loadCollection('All', 12)}
              style={{
                backgroundColor: selectedCollections === 'All' ? business.mainColor : '#dee2e6',
                color: selectedCollections === 'All' ? business.textColor : '#495057',
              }}
              className={`${
                selectedCollections === 'All'
                  ? `bg-${business.mainColor} text-${business.textColor}`
                  : 'bg-gray-200 text-gray-600'
              } w-full px-[10px] rounded-full text-center cursor-pointer font-sans`}
            >
              All
            </SwiperSlide>
            {co.collections.map(coll => (
              <SwiperSlide
                onClick={() => loadCollection(coll.collection, 12)}
                key={coll.collection}
                style={{
                  backgroundColor:
                    selectedCollections === coll.collection ? business.mainColor : '#dee2e6',
                  color: selectedCollections === coll.collection ? business.textColor : '#495057',
                }}
                className={`${
                  selectedCollections === coll.collection
                    ? `bg-${business.mainColor} text-${business.textColor}`
                    : 'bg-gray-200 text-gray-600'
                } w-full px-[10px] rounded-full text-center cursor-pointer font-sans`}
              >
                {coll.collection}
              </SwiperSlide>
            ))}
          </DynamicCollection>
        </div>

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-5">
          {visibleProducts.length > 0 ? (
            visibleProducts.map(el => <Card key={el.uuid} product={el} />)
          ) : (
            <p>No products available</p>
          )}
          <div ref={bottomBoundaryRef}></div>
        </div>

        {isClient && <div>{total > 0 && <Price />}</div>}
        {loading && <Loader />} {/* Show loader while loading products */}
      </div>
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query }) => {
  await store.dispatch(fetchBusiness());
  await store.dispatch(fetchDataProducts());
  await store.dispatch(fetchDataCollection());

  return {
    props: {
      business: store.getState().business,
      products: store.getState().products,
      collection: store.getState().collection,
    },
  };
});

const mapStateToProps = (state: AppState) => ({
  business: state.business,
  products: state.products,
});

export default connect(mapStateToProps)(Home);
