import DefaultLayout from '@/components/Layout/DefaultLayout';
import HorizontalCard from '@/components/Product/HorizontalCard';
import Head from 'next/head';
import { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { wrapper } from '@/redux/store';
import { fetchBusiness } from '@/redux/reducers/businessSlice';
import { Business } from '@/lib/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, clearCart } from '@/redux/reducers/cartSlice';
import { Empty } from '@/components/cart/Empty';
import { useTranslation } from '@/localization';
import { PaymentMethods } from '@/components/cart/PaymentMethods';
import Modal from 'react-modal';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { notification } from 'antd';
import { validateLang } from '@/lib/Fuctions';
/* --------------------------------- Lottie --------------------------------- */

/* ----------------------------------- -- ----------------------------------- */
interface CartProps {
  business: Business;
}

const Cart: NextPage<CartProps> = ({ business }) => {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();
  const cartStore = useSelector(selectCart);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationType, setAnimationType] = useState('fadeIn');
  const [modalSize, setModalSize] = useState({
    width: '50%',
    height: '35%',
  });
  useEffect(() => {
    setIsClient(true);

    function updateModalSize() {
      if (window.innerWidth < 768) {
        setModalSize({ width: '80%', height: '37%' });
      } else {
        setModalSize({ width: '50%', height: '35%' });
      }
    }

    window.addEventListener('resize', updateModalSize);
    updateModalSize();

    return () => window.removeEventListener('resize', updateModalSize);
  }, []);

  const handleClearCart = () => {
    dispatch(clearCart());
    setIsModalOpen(false);
    notification.success({
      message: validateLang(currentLanguage) ? 'تم إفراغ السلة بنجاح' : 'Cart Emptied Successfully',
    });
  };

  const openModal = () => {
    setAnimationType('fadeIn');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setAnimationType('fadeOut');
    setTimeout(() => setIsModalOpen(false), 500);
  };

  const customModalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10',
    },
    content: {
      position: 'relative',
      width: modalSize.width,
      height: modalSize.height,
      inset: 'auto',
      margin: 'auto',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px',
      animation: `${animationType} 0.5s ease-in-out`,
      animationFillMode: 'forwards',
    },
  };

  return (
    <>
      <DefaultLayout>
        <Head>
          <title>
            {currentLanguage === 'ar'
              ? `${business.title_ar} - سلة المشتريات`
              : `${business.title_en} - Cart`}
          </title>
          <meta
            property="og:description"
            content={currentLanguage === 'ar' ? business.descr_ar : business.descr_en}
            key="title"
          />
        </Head>
        {isClient ? (
          <div className="w-full">
            {cartStore.length === 0 ? (
              <Empty />
            ) : (
              <div className="flex lg:flex-row flex-col items-start lg:gap-10">
                <div className="lg:w-1/2">
                  <PaymentMethods />
                </div>
                <div className="lg:w-1/2 w-full  overflow-auto mb-10 lg:mb-0 h-full lg:h-screen">
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => openModal()}
                      className="flex items-center justify-center gap-3 text-sm font-light py-4 px-8 rounded-full transition-all ease-linear shadow-lg hover:opacity-80 bg-red-700 text-white"
                    >
                      <Trash2 width={16} height={16} />
                      <span className="mt-1">{t('clearCart')}</span>
                    </button>
                  </div>

                  {cartStore.map(item => (
                    <HorizontalCard cartItem={item} key={item?.uuid} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
        <Modal
          style={customModalStyles}
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
            <AlertTriangle className="text-yellow-500 w-10 h-10" />
            <h2 className="text-xl font-bold">{t('confirmClearCart')}</h2>
            <p className="text-center text-sm font-light px-8">{t('confirmClearCartMessage')} </p>
            <div
              className={`flex items-center gap-5 ${
                currentLanguage == 'ar' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <button
                className="w-32 h-12 flex items-center justify-center font-light py-2 px-5 mt-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110 bg-blue-500 hover:bg-blue-400 text-white text-sm"
                onClick={handleClearCart}
              >
                {t('yes')}
              </button>
              <button
                className="w-32 h-12 flex items-center justify-center font-light py-2 px-5 mt-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110 bg-red-500 hover:bg-red-400 text-white text-sm"
                onClick={() => setIsModalOpen(false)}
              >
                {t('no')}
              </button>
            </div>
          </div>
        </Modal>
      </DefaultLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async () => {
    await store.dispatch(fetchBusiness());

    return {
      props: {
        business: store.getState().business,
      },
    };
  }
);

export default Cart;