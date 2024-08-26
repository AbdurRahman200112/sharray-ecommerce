import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Lottie from 'lottie-react';
import { useTranslation } from '@/localization/index';
import { useSelector } from 'react-redux';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import * as SuccessLottie from '@/lotties/Success.json';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { useRouter } from 'next/router';

const Success = () => {
  const { t, currentLanguage } = useTranslation();
  const router = useRouter();
  const [orderNo, setOrderNo] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const bs = useSelector(selectBusiness);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cameFromCheckout = localStorage.getItem('cameFromCheckout');
      if (!cameFromCheckout) {
        router.push('/');
      } else {
        setIsClient(true);
        setTimeout(() => {
          localStorage.removeItem('cameFromCheckout');
        }, 5000);
      }

      const ls = localStorage.getItem('latestOrder');
      setOrderNo(ls ? Number(ls) : 0);
    }
  }, [router]);

  return (
    <>
      {isClient && (
        <DefaultLayout>
          <Head>
            <title>
              {currentLanguage === 'ar'
                ? `${bs.title_ar} - اتمام العملية`
                : `${bs.title_en} - Success`}
            </title>
            <meta
              property="og:description"
              content={currentLanguage === 'ar' ? bs.descr_ar : bs.descr_en}
              key="title"
            />
          </Head>
          <div className="flex flex-col justify-center items-center">
            <Lottie
              animationData={SuccessLottie}
              autoPlay={true}
              loop={false}
              height={250}
              width={250}
            />
            <div className="flex flex-col justify-center items-center gap-2 text-center">
              <span className="font-bold text-3xl">{t('successOrderThankYou')}</span>
              <span>{t('successOrderMsg')}</span>
              <span
                style={{
                  color: bs.mainColor,
                }}
                className="text-md lg:text-xl font-light text-center lg:w-[50%] px-4"
              >
                {t('successOrderNo')} #{orderNo}
              </span>
              <span className="text-gray-500">{t('successOrderNote')}</span>
            </div>
            <Link
              style={{
                background: bs.mainColor,
                color: bs.textColor,
              }}
              className="w-44 h-12 flex items-center justify-center font-light py-2 px-5 mt-5 rounded-full transition-all ease-linear shadow-lg hover:scale-110  hover:bg-opacity-95 text-white text-sm"
              href={'/'}
              replace={true}
            >
              {t('homePage')}
            </Link>
          </div>
        </DefaultLayout>
      )}
    </>
  );
};

export default Success;
