import { useSelector } from 'react-redux';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import Link from 'next/link';
import Lottie from 'lottie-react';
import * as emptyCart from '@/lotties/emptyCart.json';
import { useTranslation } from '@/localization';

export const Empty = () => {
  const { t, currentLanguage } = useTranslation();
  const bs = useSelector(selectBusiness);
  return (
    <>
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        <Lottie animationData={emptyCart} autoPlay={true} loop={true} height={250} width={250} />
        <h1
          className="text-md lg:text-xl font-light text-center w-[50%]"
          style={{
            color: bs.mainColor,
          }}
        >
          {t('emptyCartMsg')}
        </h1>
        <div className="flex items-center justify-center w-full">
          <Link
            className="text-sm font-light py-4 px-8 rounded-full transition-all ease-linear shadow-lg hover:scale-110"
            style={{
              backgroundColor: bs.mainColor,
              color: bs.textColor,
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
