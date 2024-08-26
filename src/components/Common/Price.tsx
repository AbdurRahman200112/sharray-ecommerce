import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { selectCartTotal, selectTotalItemCount } from '@/redux/reducers/cartSlice';
import { useTranslation } from '@/localization';
import { LoadingOutlined } from '@ant-design/icons';
export const Price = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const bs = useSelector(selectBusiness);
  const total = useSelector(selectCartTotal);
  const itemsLength = useSelector(selectTotalItemCount);

  const handleNavigate = async () => {
    setIsLoading(true);
    try {
      await router.push('/cart');
    } catch (error) {
      console.error('Failed to navigate:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center">
      {total > 0 && (
        <button
          onClick={handleNavigate}
          disabled={isLoading}
          style={{
            backgroundColor: bs.mainColor,
          }}
          className="flex justify-between items-center fixed bottom-2 text-2xl rounded-full px-2 h-14 lg:w-80 md:w-1/2 w-full gap-5 py-2 shadow-md "
        >
          <div
            style={{
              backgroundColor: bs.textColor,
              color: bs.mainColor,
            }}
            className="rounded-full w-10 justify-center flex items-center h-full"
          >
            <span className="mt-1 text-md">{itemsLength}</span>
          </div>
          <span
            style={{
              color: bs.textColor,
            }}
            className="mt-0.5 text-xl"
          >
            {isLoading ? <LoadingOutlined /> : total.toLocaleString('en-US') + ' ' + t('currency')}
          </span>
          <ShoppingBag
            className="mx-1"
            style={{
              color: bs.textColor,
            }}
          />
        </button>
      )}
    </div>
  );
};
