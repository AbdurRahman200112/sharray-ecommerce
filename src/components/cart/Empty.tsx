import { useSelector } from 'react-redux';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import Link from 'next/link';
import Lottie from 'lottie-react';
import * as emptyCart from '@/lotties/emptyCart.json';
import { useTranslation } from '@/localization';
import { useEffect, useState } from 'react';

export const Empty = () => {
  const { t } = useTranslation();
  const bs = useSelector(selectBusiness);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        {/* Ensure Lottie is only rendered on the client side to avoid SSR issues */}
        {isClient && (
          <Lottie animationData={emptyCart} autoPlay={true} loop={true} height={250} width={250} />
        )}
        <h1
          className="text-md lg:text-xl font-light text-center w-[50%]"
          style={{
            color: bs?.mainColor || '#000', // Provide fallback in case bs.mainColor is undefined
          }}
        >
          {t('emptyCartMsg')}
        </h1>
        <div className="flex items-center justify-center w-full">
          <Link
            className="text-sm font-light py-4 px-8 rounded-full transition-all ease-linear shadow-lg hover:scale-110"
            style={{
              backgroundColor: bs?.mainColor || '#000', // Provide fallback
              color: bs?.textColor || '#fff', // Provide fallback
            }}
            href={'/'}
          >
            {t('homePage')}
          </Link>
        </div>
      </div>
    </>
  );
};
