import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import {
  addToCart,
  decrementItemQuantity,
  incrementItemQuantity,
  isProductCart,
  removeFromCart,
} from '@/redux/reducers/cartSlice';
import { Product } from '@/lib/Interfaces';
import { AppState } from '@/redux/store';
import { useTranslation } from '@/localization';
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
  // Edit product object
  const editProduct = {
    ...product,
    quan: 1,
    notes: notes,
  };

  const cartItem = useSelector((state: AppState) =>
    state.cart.find(item => item.uuid === product?.item?.uuid)
  );

  const handleIncrement = () => {
    if (!productInCart) {
      dispatch(addToCart({ ...product?.item, quan: 1, notes }));
    } else {
      dispatch(incrementItemQuantity(product?.item?.uuid));
    }
  };

  const handleDecrement = () => {
    if (cartItem.quan == 1) {
      setIsModalOpen(true);
    } else if (cartItem && cartItem.quan > 1) {
      dispatch(decrementItemQuantity(product?.item?.uuid));
    }
  };

  const handleNotesChange = (newNotes: string) => {
    // Dispatch the action to update the cart item
    dispatch(updateCartItem({ item_uuid: product.item?.uuid, updates: { notes: newNotes } }));
  };

  return (
    <>
      <div
        className="flex item-center justify-between gap-4 bg-white rounded-full p-2"
        style={{
          background: bs.mainColor,
          color: bs.textColor,
        }}
      >
        {productInCart ? <h1 className="mt-1 text-lg font-bold mx-5">{t('quantity')}</h1> : <></>}
        <div className="flex items-center justify-start gap-10 w-full">
          {!productInCart ? (
            <button
              onClick={handleIncrement}
              className="flex items-center justify-center gap-2 text-lg font-bold text-center w-full"
            >
              <Plus />
              <span className="mt-1">{t('add')}</span>
            </button>
          ) : (
            <div className="flex items-center justify-end gap-4 w-full">
              <button
                title="Decrement"
                className=" flex justify-center items-center w-7 h-7 border rounded-full transition-all duration-300"
                style={{
                  borderColor: bs.mainColor,
                  backgroundColor: isHoveringMinus ? bs.textColor : bs.mainColor,
                  color: isHoveringMinus ? bs.mainColor : bs.textColor,
                }}
                onClick={handleDecrement}
                onMouseEnter={handleMouseEnterMinus}
                onMouseLeave={handleMouseLeaveMinus}
              >
                <Minus className="w-32 h-32" />
              </button>
              <p
                className="text-gray-800 text-2xl font-bold mt-0.5"
                style={{
                  color: bs.textColor,
                }}
              >
                {cartItem ? cartItem.quan : 1}
              </p>
              <button
                title="Increment"
                className="  w-7 h-7 flex justify-center items-center border rounded-full transition-all duration-300"
                style={{
                  borderColor: bs.mainColor,
                  backgroundColor: isHoveringPlus ? bs.textColor : bs.mainColor,
                  color: isHoveringPlus ? bs.mainColor : bs.textColor,
                }}
                onClick={handleIncrement}
                onMouseEnter={handleMouseEnterPlus}
                onMouseLeave={handleMouseLeavePlus}
              >
                <Plus className="w-32 h-32" />
              </button>
            </div>
          )}
        </div>
        <ConfirmationModal
          uuid={product?.item?.uuid}
          openModal={isModalOpen}
          closeModal={closeModal}
        />
      </div>
    </>
  );
};
function updateCartItem(arg0: { item_uuid: string; updates: { notes: string } }): any {
  throw new Error('Function not implemented.');
}
