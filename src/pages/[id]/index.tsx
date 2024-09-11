import { LoadingOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { Heart, ClipboardList as OrderNotes, Share2 } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Back from '@/components/Common/Back';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Recommendation from '@/components/Recommendation';
import Shear from '@/components/Shear';
import { BASE_IMG, BASE_URL } from '@/lib/Common';
import { Business, Product } from '@/lib/Interfaces';
import { useTranslation } from '@/localization';
import { fetchData, fetchDataProduct } from '@/redux/dataActions';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { selectCart, addToCart, incrementItemQuantity, decrementItemQuantity, updateCartItem, removeFromCart } from '@/redux/reducers/cartSlice';
import { selectFavorites, addFavorite, removeFavorite } from '@/redux/reducers/favoritesSlice';
import { selectProduct } from '@/redux/reducers/productSlice';
import { AppState, wrapper } from '@/redux/store';
import { NextPage } from 'next';

const { TextArea } = Input;

interface ProductProps {
  business: Business;
  product?: Product;
}

const ProductPage: NextPage<ProductProps> = ({ product }) => {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { title } = router.query as { title: string };

  const placeholderImage = '/placeholder.svg'; // Placeholder image path

  const businessState = useSelector(selectBusiness);
  const productState = useSelector(selectProduct);
  const cart = useSelector(selectCart);
  const favorites = useSelector(selectFavorites);

  const [isShearVisible, setShearVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [productNotes, setProductNotes] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isProductFavorite, setIsProductFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedCartItem = cart.find((item) => item.uuid === productState?.item?.uuid);

  useEffect(() => {
    if (productState?.item && selectedCartItem) {
      setIsAddedToCart(true);
      setQuantity(selectedCartItem.quan);
    }
  }, [productState, selectedCartItem]);

  useEffect(() => {
    if (productState?.item) {
      const isFavorite = favorites.some((favorite) => favorite.uuid === productState.item.uuid);
      setIsProductFavorite(isFavorite); // Update the favorite state
    }
  }, [productState, favorites]);

  const handleAddToCart = () => {
    if (productState?.item) {
      dispatch(addToCart({ ...productState.item, quan: quantity }));
      setIsAddedToCart(true);
    }
  };

  const handleNotesChange = () => {
    if (productState) {
      dispatch(updateCartItem({ uuid: productState.item.uuid, updates: { notes: productNotes } }));
    }
  };

  const handleIncrement = () => {
    if (productState?.item) {
      dispatch(incrementItemQuantity(productState.item.uuid));
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (productState?.item) {
      if (quantity > 1) {
        dispatch(decrementItemQuantity(productState.item.uuid));
        setQuantity(quantity - 1);
      } else {
        dispatch(removeFromCart(productState.item.uuid));
        setIsAddedToCart(false);
        setQuantity(1); // Reset to 1 as it's removed from the cart
      }
    }
  };

  const handleToggleFavorite = () => {
    if (isProductFavorite) {
      dispatch(removeFavorite(productState.item.uuid));
    } else {
      dispatch(addFavorite(productState.item));
    }
    setIsProductFavorite(!isProductFavorite);
  };

  const handleContinueToCart = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
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
            ? `${businessState.title_ar} - ${productState?.item?.title}`
            : `${businessState.title_en} - ${productState?.item?.title}`}
        </title>
        <meta property="og:description" content={productState?.item?.description} key="description" />
      </Head>
      <Shear
        isVisible={isShearVisible}
        onClose={() => setShearVisible(false)}
        productUrl={`${BASE_URL}${router.asPath}`}
        productTitle={productState?.item?.title}
      />
      <div className="flex flex-col min-h-screen">
        <div className="pb-5 w-full mt-5">
          <Back />
        </div>
        <div className="flex lg:flex-row flex-col gap-4 w-full">
          <Image
            className="object-cover rounded-xl w-full h-full lg:w-[50%]"
            src={productState?.item?.image ? `${BASE_IMG}/${productState?.item?.image}` : placeholderImage}
            width={600}
            height={600}
            alt="product_img"
          />
          <div className="flex flex-col lg:px-4 relative px-0 w-full lg:w-[50%]">
            <div className="flex flex-col sticky top-8 gap-4">
              <span className="font-bold text-3xl">{productState?.item?.title}</span>
              <span className="text-xl text-gray-500">{productState?.item?.collection}</span>
              <div className="flex w-full mt-4 text-2xl font-bold justify-between items-center">
                <span>
                  {productState?.item?.price?.toLocaleString('en-US')} {t('currency')}
                </span>
                <div className="flex gap-3">
                  <Heart
                    onClick={handleToggleFavorite}
                    className={`w-7 ml-2 cursor-pointer transition-colors duration-300 ${
                      isProductFavorite ? 'text-red-600 fill-current' : 'text-gray-600'
                    }`}
                  />
                  <Share2
                    onClick={() => setShearVisible(true)}
                    className="w-7 cursor-pointer"
                    style={{
                      color: businessState.mainColor,
                    }}
                  />
                </div>
              </div>
              <div
                className="flex items-center justify-start gap-2"
                style={{
                  color: businessState.mainColor,
                }}
              >
                <OrderNotes className="w-6 h-6" />
                <h1 className="font-bold text-lg mt-1">{t('orderNotes')}</h1>
              </div>
              <TextArea
                placeholder={t('notes')}
                value={productNotes}
                onChange={(e) => setProductNotes(e.target.value)}
                onBlur={handleNotesChange}
                rows={6}
              />
              {!isAddedToCart ? (
                <button
                  onClick={handleAddToCart}
                  className="text-center text-xl h-12 font-bold flex items-center justify-center gap-4 rounded-full p-2 w-full transition-colors duration-300 cursor-pointer"
                  style={{
                    color: businessState.mainColor,
                    backgroundColor: 'transparent',
                    border: `1.5px solid ${businessState.mainColor}`,
                  }}
                >
                  {t('Add to Cart')}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex gap-2 items-center"
                    style={{
                      backgroundColor: businessState.mainColor,
                      width: '100%',
                      borderRadius: '50px',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      onClick={handleDecrement}
                      className="text-xl font-bold px-4 py-2 rounded-full"
                      style={{ border: `1.5px solid ${businessState.mainColor}`, color: 'white' }}
                    >
                      -
                    </button>
                    <span style={{ color: 'white' }} className="text-xl font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="text-xl font-bold px-4 py-2 rounded-full"
                      style={{ border: `1.5px solid ${businessState.mainColor}`, color: 'white' }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    style={{
                      color: businessState.mainColor,
                      backgroundColor: 'transparent',
                      border: `1.5px solid ${businessState.mainColor}`,
                    }}
                    className="text-center text-xl h-12 font-bold flex items-center justify-center gap-4 rounded-full p-2 w-full transition-colors duration-300 cursor-pointer"
                    onClick={handleContinueToCart}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingOutlined /> : t('continueToCart')}
                  </button>
                </div>
              )}
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

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query }) => {
  const { id } = query as { id: string };

  if (id) {
    await store.dispatch(fetchDataProduct(id));
    await store.dispatch(fetchData());

    const state = store.getState();
    const product = state.products.product || null;
    const business = state.business.business || null;

    return {
      props: {
        product,
        business,
      },
    };
  }
  return {
    props: {
      product: null,
      business: null,
    },
  };
});


export default ProductPage;
