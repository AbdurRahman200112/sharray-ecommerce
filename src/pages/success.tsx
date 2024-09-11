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
import LoaderSpinner from '@/components/LoaderSpinner'; // Import the LoaderSpinner component

const Success = () => {
  const { t, currentLanguage } = useTranslation();
  const router = useRouter();
  const [orderNo, setOrderNo] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const bs = useSelector(selectBusiness);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cameFromCheckout = localStorage.getItem('cameFromCheckout');
      if (!cameFromCheckout) {
        router.push('/');
      } else {
        setTimeout(() => {
          localStorage.removeItem('cameFromCheckout');
          setLoading(false); // Hide loader after processing
        }, 2000); // Simulate a loading delay of 2 seconds
      }

      const ls = localStorage.getItem('latestOrder');
      setOrderNo(ls ? Number(ls) : 0);
    }
  }, [router]);

  return (
    <>
      {loading ? (
        <LoaderSpinner /> // Show loader while loading
      ) : (
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
              key="description"
            />
          </Head>
          <div className="flex flex-col justify-center items-center p-6">
            <Lottie
              animationData={SuccessLottie}
              autoPlay={true}
              loop={false}
              height={250}
              width={250}
            />
            <h1 className="text-2xl font-semibold mt-4">
              {t('order_success')}
            </h1>
            <p className="text-lg mt-2">
              {t('your_order_number')}: {orderNo}
            </p>
            <Link href="/">
              <a className="mt-4 text-blue-500 hover:underline">
                {t('back_to_home')}
              </a>
            </Link>
          </div>
        </DefaultLayout>
      )}
    </>
  );
};

export default Success;
