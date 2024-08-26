import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslation } from '@/localization';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '@/redux/reducers/cartSlice';
import { notification } from 'antd';
import { validateDirection, validateLang } from '@/lib/Fuctions';

export const ConfirmationModal = ({
  uuid,
  openModal,
  closeModal,
}: {
  uuid: string;
  openModal: boolean;
  closeModal: any;
}) => {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationType, setAnimationType] = useState('fadeIn');
  const [modalSize, setModalSize] = useState({
    width: '50%',
    height: '35%',
  });
  // const openModal = () => {
  //   setAnimationType('fadeIn');
  //   setIsModalOpen(true);
  // };

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
  const handelRemoveItem = () => {
    dispatch(removeFromCart(uuid)); // Dispatch the action to remove the item
    closeModal(); // Close the modal
    notification.success({
      message: validateLang(currentLanguage)
        ? 'تم ازالة العنصر بنجاح'
        : 'Items Removed Successfully!',
      placement: validateDirection(currentLanguage),
    });
  };
  return (
    <Modal
      style={customModalStyles}
      isOpen={openModal}
      onRequestClose={() => setIsModalOpen(false)}
    >
      <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
        <AlertTriangle className="text-yellow-500 w-10 h-10" />
        <h2 className="text-xl font-bold">{t('confirmRemoveItemFromCart')}</h2>
        <p className="text-center text-sm font-light px-8">
          {t('confirmRemoveItemFromCartMessage')}{' '}
        </p>
        <div
          className={`flex items-center gap-5 ${
            currentLanguage == 'ar' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <button
            className="w-32 h-12 flex items-center justify-center font-light py-2 px-5 mt-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110 bg-blue-500 hover:bg-blue-400 text-white text-sm"
            onClick={handelRemoveItem}
          >
            {t('yes')}
          </button>
          <button
            className="w-32 h-12 flex items-center justify-center font-light py-2 px-5 mt-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110 bg-red-500 hover:bg-red-400 text-white text-sm"
            onClick={() => closeModal()}
          >
            {t('no')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
