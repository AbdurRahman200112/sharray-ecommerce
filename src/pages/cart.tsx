import DefaultLayout from '@/components/Layout/DefaultLayout';
import HorizontalCard from '@/components/Product/HorizontalCard';
import Head from 'next/head';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, clearCart } from '@/redux/reducers/cartSlice';
import { Empty } from '@/components/cart/Empty';
import { useTranslation } from '@/localization';
import { PaymentMethods } from '@/components/cart/PaymentMethods';
import Modal from 'react-modal';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { notification } from 'antd';
import { validateLang } from '@/lib/Fuctions';
import { Business } from '@/lib/Interfaces';

/* --------------------------------- Lottie --------------------------------- */
/* ----------------------------------- -- ----------------------------------- */

interface CartProps {
  business: Business | null; // Adjust type to handle possible null value
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

  // Provide default values if business is undefined
  const title = business ? (currentLanguage === 'ar' ? business.title_ar : business.title_en) : 'Cart';
  const description = business ? (currentLanguage === 'ar' ? business.descr_ar : business.descr_en) : '';

  return (
    <>
      <DefaultLayout>
        <Head>
          <title>{`${title} - Cart`}</title>
          <meta
            property="og:description"
            content={description}
            key="description"
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
                <div className="lg:w-1/2 w-full overflow-auto mb-10 lg:mb-0 h-full lg:h-screen">
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => openModal()}
                      className="flex items-center justify-center gap-3 text-sm font-light py-4 px-8 rounded-full transition-all ease-linear shadow-lg hover:opacity-80 bg-red-700 text-white"
                    >
                      <Trash2 width={16} height={16} />
                      <span className="mt-1">{t('emptyCart')}</span>
                    </button>
                  </div>
                  {cartStore.map(item => (
                    <HorizontalCard cartItem={item} key={item.item_uuid} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </DefaultLayout>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Confirm Modal"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <AlertTriangle size={64} className="text-red-600" />
          <p className="mt-4 text-lg font-semibold">{t('confirmClearCart')}</p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleClearCart}
              className="py-2 px-4 bg-red-600 text-white rounded-md"
            >
              {t('confirm')}
            </button>
            <button
              onClick={closeModal}
              className="py-2 px-4 bg-gray-200 text-black rounded-md"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
