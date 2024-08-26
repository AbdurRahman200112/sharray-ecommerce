import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/localization';
import { useState } from 'react';
import { BASE_IMG } from '@/lib/Common';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { CartItem } from '@/lib/Interfaces';
import { Plus, Minus, Trash2 } from 'lucide-react';
import {
  removeFromCart,
  decrementItemQuantity,
  incrementItemQuantity,
} from '@/redux/reducers/cartSlice';
import Modal from 'react-modal';
import { ConfirmationModal } from '../Common/ConfirmationModal';

export default function HorizontalCard({ cartItem }: { cartItem: CartItem }) {
  const ph = '/placeholder.svg'; // Path to Placeholder image
  const { t } = useTranslation();
  const bs = useSelector(selectBusiness);

  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [isHoveringPlus, setIsHoveringPlus] = useState(false);
  const [isHoveringMinus, setIsHoveringMinus] = useState(false);
  const handleMouseEnterPlus = () => setIsHoveringPlus(true);
  const handleMouseLeavePlus = () => setIsHoveringPlus(false);
  const handleMouseEnterMinus = () => setIsHoveringMinus(true);
  const handleMouseLeaveMinus = () => setIsHoveringMinus(false);

  return (
    <div
      style={{ borderColor: bs.mainColor }}
      className="bg-white shadow-md rounded-xl overflow-hidden my-4 p-4 border-2 transition-transform duration-500 ease-in-out delay-150 hover:scale-105"
    >
      <div className="flex items-center justify-between h-32 gap-4">
        <Link
          href={`/product/${cartItem.item_uuid}`}
          className="flex-shrink-0 lg:w-[20%] w-[30%] p-3 rounded-xl transition-transform duration-400 ease-in-out delay-200 hover:scale-110"
        >
          <Image
            className={`object-cover w-full h-full rounded-xl min-h-full transition-opacity duration-700 ease-in-out delay-100`}
            width={80}
            height={80}
            src={imageError ? ph : `${BASE_IMG}/${cartItem.image}`}
            alt={cartItem.title || 'Product Image'}
            placeholder="blur"
            blurDataURL={ph}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </Link>
        <div className="flex-grow p-2">
          <div className="flex items-start justify-between mb-2">
            <Link
              href={`/product/${cartItem.item_uuid}`}
              className="text-xl font-semibold transition-colors duration-300 delay-100 hover:text-blue-600"
            >
              {cartItem.title}
            </Link>

            <button
              title="Remove product from cart"
              className="cursor-pointer text-red-500 transition-colors duration-300 delay-100 hover:text-red-700"
              onClick={() => setIsModalOpen(true)}
            >
              <Trash2 />
            </button>
          </div>
          <p className="text-xs font-light truncate mb-2">{cartItem.notes}</p>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {(cartItem.price * cartItem.quan).toLocaleString('en-US')} {t('currency')}
            </h1>
            <div className="flex items-center gap-4">
              <button
                title="Decrement"
                className="flex justify-center items-center w-8 h-8 border rounded-full transition-all duration-300 ease-in-out delay-150"
                style={{
                  borderColor: bs.mainColor,
                  backgroundColor: isHoveringMinus ? bs.mainColor : 'transparent',
                  color: isHoveringMinus ? bs.textColor : bs.mainColor,
                }}
                onClick={() => {
                  if (cartItem.quan === 1) {
                    setIsModalOpen(true);
                  } else {
                    dispatch(decrementItemQuantity(cartItem.item_uuid));
                  }
                }}
                onMouseEnter={handleMouseEnterMinus}
                onMouseLeave={handleMouseLeaveMinus}
              >
                <Minus />
              </button>
              <p className="text-gray-800 text-xl font-light">{cartItem.quan}</p>
              <button
                title="Increment"
                className="w-8 h-8 flex justify-center items-center border rounded-full transition-all duration-300 ease-in-out delay-150"
                style={{
                  borderColor: bs.mainColor,
                  backgroundColor: isHoveringPlus ? bs.mainColor : 'transparent',
                  color: isHoveringPlus ? bs.textColor : bs.mainColor,
                }}
                onClick={() => dispatch(incrementItemQuantity(cartItem.item_uuid))}
                onMouseEnter={handleMouseEnterPlus}
                onMouseLeave={handleMouseLeavePlus}
              >
                <Plus />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        uuid={cartItem.item_uuid}
        openModal={isModalOpen}
        closeModal={closeModal}
      />
    </div>
  );
}
