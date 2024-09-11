import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/localization';
import { removeFromCart } from '@/redux/reducers/cartSlice';

export const ConfirmationModal = ({
  uuid,
  openModal,
  closeModal,
}: {
  uuid: string;
  openModal: boolean;
  closeModal: () => void;
}) => {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();

  // Custom styles for the modal
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
      width: '90%',
      maxWidth: '500px', // Set a max-width for larger screens
      height: 'auto',
      maxHeight: '80vh', // Set a max-height to fit smaller screens
      inset: 'auto',
      margin: 'auto',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px',
      animation: `fadeIn 0.5s ease-in-out`,
      animationFillMode: 'forwards',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle shadow for better visibility
    },
  };

  // Function to handle the removal of the item
  const handleRemoveItem = () => {
    if (uuid) {
      dispatch(removeFromCart(uuid)); // Dispatches an action to remove the item with the given UUID
      closeModal(); // Closes the modal after the action
    }
  };

  return (
    <Modal
      style={customModalStyles}
      isOpen={openModal}
      onRequestClose={closeModal}
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <AlertTriangle className="text-yellow-500 w-12 h-12" />
        <h2 className="text-xl font-bold text-center">{t('confirmRemoveItemFromCart')}</h2>
        <p className="text-center text-sm font-light px-4 md:px-8">
          {t('confirmRemoveItemFromCartMessage')}
        </p>
        <div
          className={`flex flex-col md:flex-row gap-4 md:gap-5 ${
            currentLanguage === 'ar' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <button
            className="w-full md:w-32 h-12 flex items-center justify-center font-light py-2 px-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110 bg-blue-500 hover:bg-blue-400 text-white text-sm"
            onClick={handleRemoveItem}
          >
            {t('yes')}
          </button>
          <button
            className="w-full md:w-32 h-12 flex items-center justify-center font-light py-2 px-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110 bg-red-500 hover:bg-red-400 text-white text-sm"
            onClick={closeModal}
          >
            {t('no')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
