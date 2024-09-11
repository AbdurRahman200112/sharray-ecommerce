import { Product } from '@/lib/Interfaces';
import { useTranslation } from '@/localization';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import {
  addToCart,
  decrementItemQuantity,
  incrementItemQuantity,
  isProductCart,
} from '@/redux/reducers/cartSlice';
import { AppState } from '@/redux/store';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmationModal } from '../Common/ConfirmationModal';

export const Counter = ({ product, notes }: { product: Product; notes: string }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const bs = useSelector(selectBusiness);
  const [isHoveringPlus, setIsHoveringPlus] = useState(false);
  const [isHoveringMinus, setIsHoveringMinus] = useState(false);
  const handleMouseEnterPlus = () => setIsHoveringPlus(true);
  const handleMouseLeavePlus = () => setIsHoveringPlus(false);
  const handleMouseEnterMinus = () => setIsHoveringMinus(true);
  const handleMouseLeaveMinus = () => setIsHoveringMinus(false);
  const productInCart = useSelector((state: AppState) => isProductCart(state)(product?.uuid));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures client-side rendering
  }, []);

  // Fetch cart item from state only when client-side rendering
  const cartItem = isClient
    ? useSelector((state: AppState) =>
        state.cart.find(item => item.uuid === product?.item?.uuid)
      )
    : null;

  // Handle Increment
  const handleIncrement = () => {
    if (!productInCart) {
      dispatch(addToCart({ ...product?.item, quan: 1, notes }));
    } else {
      dispatch(incrementItemQuantity(product?.item?.uuid));
    }
  };

  // Handle Decrement
  const handleDecrement = () => {
    if (cartItem?.quan === 1) {
      setIsModalOpen(true); // Open modal to confirm removal
    } else if (cartItem && cartItem.quan > 1) {
      dispatch(decrementItemQuantity(product?.item?.uuid));
    }
  };

  const handleNotesChange = (newNotes: string) => {
    dispatch(updateCartItem({ item_uuid: product.item?.uuid, updates: { notes: newNotes } }));
  };

  return (
    <>
      <div
        className="flex items-center justify-between gap-4 bg-white rounded-full p-2"
        style={{
          background: bs.mainColor,
          color: bs.textColor,
        }}
      >
        <div className="flex items-center justify-center gap-4 w-full">
          {/* Decrement Button */}
          <button
            title="Decrement"
            className="flex justify-center items-center w-10 h-10 border rounded-full transition-all duration-300"
            style={{
              borderColor: bs.mainColor,
              backgroundColor: isHoveringMinus ? bs.textColor : bs.mainColor,
              color: isHoveringMinus ? bs.mainColor : bs.textColor,
            }}
            onClick={handleDecrement}
            onMouseEnter={handleMouseEnterMinus}
            onMouseLeave={handleMouseLeaveMinus}
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Display Quantity */}
          <p
            className="text-gray-800 text-2xl font-bold mt-0.5"
            style={{
              color: bs.textColor,
              textAlign: 'center',
            }}
          >
            {cartItem ? cartItem.quan : 1}
          </p>

          {/* Increment Button */}
          <button
            title="Increment"
            className="flex justify-center items-center w-10 h-10 border rounded-full transition-all duration-300"
            style={{
              borderColor: bs.mainColor,
              backgroundColor: isHoveringPlus ? bs.textColor : bs.mainColor,
              color: isHoveringPlus ? bs.mainColor : bs.textColor,
            }}
            onClick={handleIncrement}
            onMouseEnter={handleMouseEnterPlus}
            onMouseLeave={handleMouseLeavePlus}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmation Modal for Removing Product */}
        {isModalOpen && (
          <ConfirmationModal
            uuid={product?.item?.uuid}
            openModal={isModalOpen}
            closeModal={closeModal}
          />
        )}
      </div>
    </>
  );
};

// Helper function to update cart item
function updateCartItem(arg0: { item_uuid: string; updates: { notes: string } }): any {
  throw new Error('Function not implemented.');
}
