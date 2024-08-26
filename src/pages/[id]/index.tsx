import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { fetchDataProduct, fetchRecommendationProducts } from '@/redux/dataActions';
import { fetchBusiness, selectBusiness } from '@/redux/reducers/businessSlice';
import { AppState, wrapper } from '@/redux/store';
import { connect, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Business, Product } from '@/lib/Interfaces';
import { selectProduct } from '@/redux/reducers/productSlice';

import { BASE_IMG, BASE_URL } from '@/lib/Common';
import { useTranslation } from '@/localization';
import { Heart, Share2, ClipboardList as OrderNotes } from 'lucide-react';
import { Input } from 'antd';

import Image from 'next/image';
import Back from '@/components/Common/Back';
import Shear from '@/components/Shear';
import DefaultLayout from '@/components/Layout/DefaultLayout';

import { addFavorite, isFavorite, removeFavorite } from '@/redux/reducers/favoritesSlice';
import { useRouter } from 'next/router';
import Recommendation from '@/components/Recommendation';
import { Counter } from '@/components/cart/Counter';
import { selectCartNotes, updateCartItem } from '@/redux/reducers/cartSlice';
import IconText from '@/components/Navbar/IconText';
import { LoadingOutlined } from '@ant-design/icons';
const { TextArea } = Input;

interface ProductProps {
  business: Business;
  product?: Product;
}

const index: NextPage<ProductProps> = () => {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const ph = '/placeholder.svg'; // Path to Placeholder image

  const bs = useSelector(selectBusiness);
  const pr = useSelector(selectProduct);

  const selectedNotes = useSelector((state: AppState) => selectCartNotes(state)(pr?.uuid));
  const [isShearVisible, setShearVisible] = useState(false);
  const [notes, setNotes] = useState(selectedNotes);
  const [productNotes, setProductNotes] = useState(notes);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  const handleNotesChange = () => {
    dispatch(updateCartItem({ item_uuid: pr?.uuid, updates: { notes: productNotes } }));
  };

  const isProductFavorite = useSelector((state: AppState) => isFavorite(state)(pr?.uuid));
  const fullProductUrl = `${BASE_URL}${router.asPath}`; // Shear link

  const toggleFav = () => {
    if (pr) {
      if (isProductFavorite) {
        dispatch(removeFavorite(pr.uuid));
      } else {
        dispatch(addFavorite(pr));
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleContinueToCart = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/cart');
    } catch (error) {
      console.error('Error during navigation', error);
    }
    setIsLoading(false);
  };
  return (
    <DefaultLayout>
      <Head>
        <title>
          {currentLanguage === 'ar'
            ? `${bs.title_ar} - ${pr?.item?.title}`
            : `${bs.title_en} - ${pr?.item?.title}`}
        </title>
        <meta property="og:description" content={pr?.item?.description} key="title" />
      </Head>
      <Shear
        isVisible={isShearVisible}
        onClose={() => setShearVisible(false)}
        productUrl={fullProductUrl}
        productTitle={pr?.item?.title}
      />
      <div className="flex flex-col  min-h-screen ">
        <div className=" pb-5 w-full">
          <Back />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 w-full">
          <Image
            className="object-cover rounded-xl w-full h-full lg:w-[50%]"
            src={pr?.item?.image ? `${BASE_IMG}/${pr?.item?.image}` : ph}
            width={600}
            height={600}
            alt="product_img"
          />
          <div className="flex flex-col lg:px-4 relative px-0 w-full lg:w-[50%] ">
            <div className="flex flex-col sticky top-8 gap-4">
              <span className="font-bold text-3xl">{pr?.item?.title}</span>
              <span className="text-xl text-gray-500">{pr?.item?.collection}</span>
              <div className="flex w-full mt-4 text-2xl font-bold justify-between items-center">
                <span className="">
                  {pr?.item?.price?.toLocaleString('en-US')} {t('currency')}
                </span>
                <div className="flex gap-3">
                  {isClient ? (
                    <Heart
                      onClick={toggleFav}
                      className={`w-7 cursor-pointer ${
                        isProductFavorite ? 'text-red-600 fill-current' : 'text-red-600'
                      }`}
                    />
                  ) : (
                    <Heart onClick={toggleFav} className={`w-7 cursor-pointer text-red-600`} />
                  )}

                  <Share2
                    onClick={() => setShearVisible(true)}
                    className="w-7 cursor-pointer"
                    style={{
                      color: bs.mainColor,
                    }}
                  />
                </div>
              </div>
              <p className="my-4 text-gray-500">{pr?.item?.description} </p>
              <div
                className="flex items-center justify-start gap-2"
                style={{
                  color: bs.mainColor,
                }}
              >
                <OrderNotes className="w-6 h-6" />
                <h1 className="font-bold text-lg mt-1">{t('orderNotes')}</h1>
              </div>
              <TextArea
                placeholder={t('notes')}
                value={productNotes}
                onChange={e => setProductNotes(e.target.value)}
                onBlur={handleNotesChange}
                rows={6}
              />

              <div>{isClient ? <Counter product={pr} notes={notes} /> : <></>}</div>
              <div>
                {isClient ? (
                  <button
                    style={{
                      color: bs.mainColor,
                      backgroundColor: 'transparent',
                      border: `1.5px solid ${bs.mainColor}`,
                    }}
                    className="text-center text-xl h-12 font-bold flex items-center justify-center gap-4 rounded-full p-2 w-full transition-colors duration-300 cursor-pointer"
                    onClick={handleContinueToCart}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingOutlined /> : t('continueToCart')}
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-10 z-10">
          <h1 className="text-2xl font-bold my-2">{t('youMayAlsoLike')}</h1>
          <Recommendation />
        </div>
      </div>
    </DefaultLayout>
  );
};

/* --------------------------------- Server --------------------------------- */
// Getting data as SSR
export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query }) => {
  console.log('query is: ', query);
  const { id } = query as { id: string };
  console.log('id is :', id);
  if (id) {
    await store.dispatch(fetchDataProduct(id));
    await store.dispatch(fetchBusiness());
    const product = store.getState()?.products.product;
    // await store.dispatch(fetchRecommendationProducts(product.collection));
    return {
      props: {
        business: store.getState().business,
        product: product ?? null,
      },
    };
  }
  return { notFound: true };
});
const mapStateToProps = (state: AppState) => ({
  business: state.business,
  products: state.products,
});
export default connect(mapStateToProps)(index);
/* ----------------------------------- -- ----------------------------------- */
