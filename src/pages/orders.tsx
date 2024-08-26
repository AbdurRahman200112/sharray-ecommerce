import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Lottie from 'lottie-react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { HeartOutlined } from '@ant-design/icons';
import { useTranslation } from '@/localization/index';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import * as favoLottie from '@/lotties/favoLottie.json';
import * as ordersItem from '@/lotties/Success.json';
import * as noOrders from '@/lotties/noOrders.json';

import { selectBusiness } from '@/redux/reducers/businessSlice';

const Favorites = () => {
  const { t, currentLanguage } = useTranslation();

  const [favourites, setFavourites] = useState([]);

  const business = useSelector(selectBusiness);

  const mainColor = business?.mainColor;
  const textColor = business?.textColor;
  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedItems;
      try {
        storedItems = JSON.parse(localStorage.getItem('orders')) || [];
        storedItems.sort((a, b) => b.timestamp - a.timestamp);
        setFavourites(storedItems);
      } catch (e) {
        console.error("Error parsing 'heart' item from localStorage:", e);
        setFavourites([]);
      }
    }
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>
          {currentLanguage === 'ar'
            ? `${business.title_ar} - الطلبات الحالية`
            : `${business.title_en} - Current orders`}
        </title>
        <meta
          property="og:description"
          content={currentLanguage === 'ar' ? business.descr_ar : business.descr_en}
          key="title"
        />
      </Head>
      <div className="flex flex-col gap-4">
        {favourites.length > 0 ? (
          favourites.map(item => (
            <div className="flex bg-white shadow rounded-xl justify-between">
              <div key={item.item_uuid}>
                <div className="flex">
                  <div className="w-36">
                    <Lottie animationData={ordersItem} loop={false} autoPlay={true} />
                  </div>
                  <div className="m-4 flex flex-col">
                    <h2 className="text-xl  font-bold">{item.orderNumber}</h2>
                    <span
                      style={{ background: mainColor, color: textColor }}
                      className="font-semibold my-1  w-fit px-3 py-1 pt-1.5 rounded-full"
                    >
                      {formatDate(item.timestamp)}
                    </span>
                    <span style={{ color: mainColor }} className=" my-1 ">
                      {item.description || item.item_uuid}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-col gap-4 items-center justify-center mt-20">
            <Lottie animationData={noOrders} loop={true} autoPlay={true} height={250} width={250} />
            <div
              className="text-md lg:text-xl font-light text-center lg:w-[50%] px-4"
              style={{
                color: business.mainColor,
              }}
            >
              {t('noOrdersMessage')}
            </div>
            <div className="flex items-center justify-center w-full">
              <Link
                className="text-sm font-light py-4 px-8 rounded-full transition-all ease-linear shadow-lg hover:scale-110"
                style={{
                  backgroundColor: business.mainColor,
                  color: business.textColor,
                }}
                href={'/'}
              >
                {t('homePage')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Favorites;
