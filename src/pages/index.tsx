import Link from 'next/link';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/localization/index';
import { AppState, wrapper } from '@/redux/store';
import { fetchBusiness, selectBusiness } from '@/redux/reducers/businessSlice';
import { fetchDataCollection, fetchDataProducts } from '@/redux/dataActions';
import { connect, useDispatch, useSelector } from 'react-redux';
import { selectCollection } from '@/redux/reducers/collectionSlice';
import { Business, Product, CollectionItem } from '@/lib/Interfaces';
import { NextPage } from 'next';
import { SwiperSlide } from 'swiper/react';
import {
  selectCurrentPage,
  selectProducts,
  selectTotalRecords,
  setNewData,
  setProductsData,
} from '@/redux/reducers/productSlice';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Collection from '@/components/Swiper/Collection';
import Card from '@/components/Product/Card';
import { Loader } from '@/components/Common/Loader';
import { BASE_URL } from '@/lib/Common';
import { selectCartTotal } from '@/redux/reducers/cartSlice';
import { Price } from '@/components/Common/Price';

const Home: NextPage = ({ business, products }: { business: Business; products: Product[] }) => {
  const { t, currentLanguage } = useTranslation();

  const bs = useSelector(selectBusiness);
  const pd = useSelector(selectProducts);
  const cr = useSelector(selectCurrentPage);
  const ta = useSelector(selectTotalRecords);
  const pages = Math.ceil(Number(ta) / 10);
  const co = useSelector(selectCollection);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  const DynamicCollection = dynamic(() => import('@/components/Swiper/Collection'), {
    ssr: false, // Disable server-side rendering for this component
  });

  const bottomBoundaryRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState('All');

  const isBottomVisible = useCallback((element: HTMLDivElement | null) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }, []);

  const loadMore = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/public/items?page=${Number(cr) + 1}`);
      const data = await response.json();
      dispatch(
        setNewData({
          data: data.data,
          currentPage: data.currentPage,
        })
      );
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollection = async (collectionName: string) => {
    setLoading(true);
    setSelectedCollections(collectionName);
    
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/public/items${collectionName !== 'All' ? `?collection=${collectionName}` : ''}`
      );
      const data = await response.json();
      dispatch(
        setProductsData({
          data: data.items,  // Ensure this matches the structure of your data
          currentPage: data.currentPage,
          totalRecords: data.totalRecords,
        })
      );
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionsKeywords = (collections: CollectionItem[]) => {
    return collections.map(coll => coll.collection);
  };

  useEffect(() => {
    const onScroll = async () => {
      if (loading || cr >= pages) return;

      if (bottomBoundaryRef.current && isBottomVisible(bottomBoundaryRef.current)) {
        await loadMore();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, cr, pages, isBottomVisible]);

  useEffect(() => {
    setIsClient(true); // Ensure that we are running client-side code
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
        <meta name="keywords" content={loadCollectionsKeywords(co.collections).join(', ')} />
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
              onClick={() => loadCollection('All')}
              style={{
                backgroundColor: selectedCollections === 'All' ? business.mainColor : '#dee2e6',
                color: selectedCollections === 'All' ? business.textColor : '#495057',
              }}
              className={`${
                selectedCollections === 'All'
                  ? 'bg-[mainColor] text-[textColor]'
                  : 'bg-gray-200 text-gray-600'
              } w-full px-[10px] rounded-full text-center cursor-pointer font-sans`}
            >
              All
            </SwiperSlide>
            {co.collections.map(coll => (
              <SwiperSlide
                onClick={() => loadCollection(coll.collection)}
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
                }  w-full px-[10px] rounded-full text-center cursor-pointer font-sans `}
              >
                {coll.collection}
              </SwiperSlide>
            ))}
          </DynamicCollection>
        </div>

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-5">
          {pd?.items?.map(el => (
            <Card key={el.uuid} product={el} />
          ))}
          <div ref={bottomBoundaryRef}></div> {/* Invisible element at the bottom */}
        </div>

        {/* Price tag */}
        {isClient && <div>{total > 0 && <Price />}</div>}

        {/* Loader */}
        {loading && <Loader />}
      </div>
    </DefaultLayout>
  );
};

/* --------------------------------- Server --------------------------------- */
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
