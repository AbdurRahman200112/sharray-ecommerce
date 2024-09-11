import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { selectCartTotal, selectTotalItemCount } from '@/redux/reducers/cartSlice';
import { useTranslation } from '@/localization';
import { LoadingOutlined } from '@ant-design/icons';

export const Price = () => {
  const { t } = useTranslation(); // Localization hook for translations
  const router = useRouter(); // Next.js router for navigation
  const [isLoading, setIsLoading] = useState(false); // State for handling the loading spinner
  const bs = useSelector(selectBusiness); // Selecting business data from Redux
  const total = useSelector(selectCartTotal); // Selecting the total cart amount
  const itemsLength = useSelector(selectTotalItemCount); // Selecting the total number of items in the cart

  // Function to handle navigation to the cart page
  const handleNavigate = async () => {
    setIsLoading(true);
    try {
      await router.push('/cart');
    } catch (error) {
      console.error('Failed to navigate:', error);
    }
    setIsLoading(false);
  };

  // Only display the button if the total is greater than 0
  return (
    <div className="flex justify-center">
      {total > 0 && (
        <button
          onClick={handleNavigate} // Navigate to cart on click
          disabled={isLoading} // Disable button while loading
          style={{
            backgroundColor: bs.mainColor, // Use business main color
          }}
          className="flex justify-between items-center fixed bottom-2 text-2xl rounded-full px-2 h-14 lg:w-80 md:w-1/2 w-full gap-5 py-2 shadow-md"
        >
          <div
            style={{
              backgroundColor: bs.textColor, // Use business text color
              color: bs.mainColor, // Reverse the colors for contrast
            }}
            className="rounded-full w-10 flex items-center justify-center h-full"
          >
            <span className="mt-1 text-md">{itemsLength}</span> {/* Display the total number of items */}
          </div>

          <span
            style={{
              color: bs.textColor, // Use business text color
            }}
            className="mt-0.5 text-xl"
          >
            {/* Display total price or loading spinner */}
            {isLoading ? <LoadingOutlined /> : total.toLocaleString('en-US') + ' ' + t('currency')}
          </span>

          {/* Shopping bag icon */}
          <ShoppingBag
            className="mx-1"
            style={{
              color: bs.textColor, // Use business text color
            }}
          />
        </button>
      )}
    </div>
  );
};
