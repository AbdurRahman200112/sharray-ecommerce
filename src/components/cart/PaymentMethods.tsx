import React, { useState } from 'react';
import Link from 'next/link';
import { Master } from '@/icons/Master';
import { Zain } from '@/icons/Zain';
import { Wallet } from 'lucide-react';
import { useTranslation } from '@/localization';
import { useSelector } from 'react-redux';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { selectCartTotal } from '@/redux/reducers/cartSlice';
import { LoaderWhite } from '@/components/Common/LoaderWhite';
import { LoadingOutlined } from '@ant-design/icons';
export const PaymentMethods = () => {
  const { t, currentLanguage } = useTranslation();
  const bs = useSelector(selectBusiness);
  const total = useSelector(selectCartTotal);
  const [selectedMethod, setSelectedMethod] = useState('cashOnDelivery');
  const [isLoading, setIsLoading] = useState(false);
  const paymentMethods = [
    {
      id: 'cashOnDelivery',
      label: t('cash'),
      icon: <Wallet />,
      disabled: false,
    },
    {
      id: 'zainCash',
      label: t('zain'),
      icon: <Zain />,
      disabled: true,
    },
    {
      id: 'masterCard',
      label: t('credit'),
      icon: <Master />,
      disabled: true,
    },
  ];
  const handleMethodChange = method => {
    setSelectedMethod(method);
  };

  const handleConfirmClick = async () => {
    setIsLoading(true); // Start loading

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {}
    setIsLoading(false);
  };
  return (
    <>
      <div>
        <div className="mt-4 lg:mb-0 mb-10">
          <h2 className="text-2xl font-bold mb-5">{t('paymentWays')}</h2>

          <div className="flex flex-col items-start gap-2 w-full mt-2">
            <p
              className="p-5 rounded-lg"
              style={{
                background: bs.mainColor,
                color: bs.textColor,
              }}
            >
              * {t('cartNotice')}
            </p>
            <div className="w-full">
              <div className="flex flex-col items-start w-full">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`bg-white w-full p-4 border-2 rounded-xl my-2 transition duration-300 ${
                      selectedMethod === method.id ? '' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: selectedMethod === method.id ? 'white' : 'white',
                      color: selectedMethod === method.id ? bs.mainColor : 'black',
                      borderColor: selectedMethod === method.id ? bs.mainColor : 'transparent',
                      transform: 'scale(1)',
                      cursor: method.disabled ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => {
                      if (!method.disabled && selectedMethod !== method.id) {
                        handleMethodChange(method.id);
                      }
                    }}
                  >
                    <div className="flex  items-center justify-start w-full">
                      <input
                        title="Chose Payment"
                        style={{
                          accentColor: bs.mainColor,
                        }}
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        className={`h-full ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`}
                        disabled={method.disabled}
                        checked={selectedMethod === method.id}
                        readOnly
                      />
                      <div className="flex items-center justify-start gap-2 text-sm">
                        <span className="text-2xl">{method.icon}</span>
                        <span>{method.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link
            className="fixed lg:relative bottom-2 lg:bottom-0 left-0 w-full lg:w-[50%] px-5 lg:px-2"
            href={'/checkout'}
            passHref
          >
            <button
              style={{
                background: bs.mainColor,
                color: bs.textColor,
              }}
              className="w-full flex justify-between .5 items-center gap-2 h-12 rounded-full shadow-sm mt-2 cursor-pointer"
              onClick={handleConfirmClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="text-xl mt-0.5 px-3.5 text-center w-full">
                  <LoadingOutlined />
                </span>
              ) : (
                <span className="text-xl mt-0.5 px-3.5">{t('confirm')}</span>
              )}
              {isLoading ? (
                <></>
              ) : (
                <div
                  style={{
                    color: bs.mainColor,
                    backgroundColor: bs.textColor,
                  }}
                  className="text-xl flex font-semibold pt-1.5 mx-1.5 items-center  px-3 h-fit w-fit py-1 rounded-full"
                >
                  {total.toLocaleString('en-US')} {t('currency')}
                </div>
              )}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
