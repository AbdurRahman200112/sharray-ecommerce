import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { BASE_IMG } from '@/lib/Common';
import { useTranslation } from '@/localization/index';

import { Check, Plus } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { Product } from '@/lib/Interfaces';
import { addToCart, isProductCart } from '@/redux/reducers/cartSlice';
import { AppState } from '@/redux/store';
import { notification } from 'antd';
import { validateDirection, validateLang } from '@/lib/Fuctions';

export default function Card({ product }: { product: Product }) {
  const ph = '/placeholder.svg'; // Path to Placeholder image
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();

  const bs = useSelector(selectBusiness);
  const { mainColor, textColor, title_ar, title_en, logo } = bs;
  const [windowWidth, setWindowWidth] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const productInCart = useSelector((state: AppState) => isProductCart(state)(product?.uuid));
  // Adding the product to the cart without note
  const handleAddToCart = () => {
    const productToAdd: any = {
      ...product,
      quan: 1,
      notes: '',
    };
    dispatch(addToCart(productToAdd));
    notification.success({
      message: validateLang(currentLanguage) ? 'تم اضافة العنصر الى السلة' : 'Item Added to cart',
      placement: validateDirection(currentLanguage),
    });
  };

  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <div
        key={product.uuid}
        className="rounded-xl h-fit bg-white border-[0.9px] w-full animate-fadeInBottom hover:lg:scale-[1.02]  transition-all duration-200 ease-in-out"
      >
        <Link key={product.uuid} href={`/${product.uuid}`}>
          <div className="w-full relative lg:h-[68%] flex justify-center items-center overflow-hidden">
            <Image
              className={`object-cover w-full h-56 lg:h-72 rounded-t-xl min-h-full transition-opacity duration-500 animate-fadeIn`}
              width={240}
              loading="lazy"
              height={180}
              src={imageError ? ph : `${BASE_IMG}/${product.image}`}
              alt={product.title || 'Product Image'}
              placeholder="blur"
              blurDataURL={ph}
              onError={() => setImageError(true)}
            />

            <div
              className="absolute bottom-2 left-2 px-4 py-1 pt-1.5 rounded-full text-xs"
              style={{
                color: textColor,
                backgroundColor: mainColor,
              }}
            >
              {product.collection}
            </div>
          </div>
        </Link>
        <div className="w-full md:p-2 flex flex-col justify-between h-[30%] leading-5 font-bold text-black">
          <Link
            key={product.uuid}
            href={`/${product.uuid}`}
            className="flex flex-col p-2 md:p-0 lg:h-14 h-full "
          >
            <span className="lg:text-xl text-md lg:line-clamp-3 line-clamp-2">{product.title}</span>
            <span className="text-xs text-wrap font-light truncate mt-2 px-1">
              {product.description ? product.description : ''}
            </span>
          </Link>

          <div className="flex md:flex-row  flex-col justify-between items-center pt-5">
            <span
              style={{
                borderColor: mainColor,
              }}
              className="mt-2 flex gap-1 w-full md:border-none border-t-[0.9px] py-2 md:py-0 justify-center md:justify-start text-xl items-start"
            >
              {product.price.toLocaleString('en-US')}
              <span className="lg:text-lg text-sm">{t('currency')}</span>
            </span>
            {windowWidth <= 768 ? (
              <button
                style={{ color: textColor, backgroundColor: mainColor }}
                className="w-full rounded-b-xl py-3"
                onClick={handleAddToCart}
              >
                {isClient ? productInCart ? t('alreadyAdded') : t('add') : <></>}
              </button>
            ) : (
              <div className="group">
                {productInCart ? (
                  <div
                    style={{ color: mainColor, borderColor: mainColor }}
                    className="lg:w-12 w-10 lg:h-12 h-10 rounded-full border-[1.2px] flex items-center justify-center cursor-not-allowed"
                  >
                    <Check />
                  </div>
                ) : (
                  <button
                    style={{ color: mainColor, borderColor: mainColor }}
                    className="border-[1.2px] font-bold lg:w-12 w-10 lg:h-12 h-10 flex text-2xl flex-row justify-center items-center rounded-full transition-all duration-400 ease-in-out group-hover:w-fit group-hover:px-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor"
                    onClick={handleAddToCart}
                  >
                    <span className="hidden lg:group-hover:flex mx-2 mt-1 transition-opacity delay-300 duration-500 ease-in-out text-xl opacity-0 group-hover:opacity-100">
                      {t('add')}
                    </span>
                    <Plus />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
