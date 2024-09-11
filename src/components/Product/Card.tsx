import { BASE_IMG } from '@/lib/Common';
import { Product } from '@/lib/Interfaces';
import { useTranslation } from '@/localization/index';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { addToCart, isProductCart } from '@/redux/reducers/cartSlice';
import { addFavorite, removeFavorite, selectFavorites } from '@/redux/reducers/favoritesSlice';
import { AppState } from '@/redux/store';
import { notification } from 'antd';
import { Check, Heart, Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Card({ product }: { product: Product | null }) {
  const ph = '/placeholder.svg';
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();

  const bs = useSelector(selectBusiness);
  const favorites = useSelector(selectFavorites);
  const { mainColor, textColor } = bs;
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const productInCart = product ? useSelector((state: AppState) => isProductCart(state)(product.uuid)) : false;
  const isProductFavorite = product ? favorites.some(favorite => favorite.uuid === product.uuid) : false;

  const handleAddToCart = () => {
    if (!product) return;
    setIsLoading(true);
    const productToAdd = {
      ...product,
      quan: 1,
      notes: '',
    };
    setTimeout(() => {
      dispatch(addToCart(productToAdd));
      setIsLoading(false);
      notification.success({
        message: currentLanguage === 'ar' ? 'تم اضافة العنصر الى السلة' : 'Item Added to cart',
        placement: currentLanguage === 'ar' ? 'topLeft' : 'topRight',
      });
    }, 2000);
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    if (isProductFavorite) {
      dispatch(removeFavorite(product.uuid));
      notification.success({
        message: currentLanguage === 'ar' ? 'تم إزالة العنصر من المفضلة' : 'Item removed from favorites',
        placement: currentLanguage === 'ar' ? 'topLeft' : 'topRight',
      });
    } else {
      dispatch(addFavorite(product));
      notification.success({
        message: currentLanguage === 'ar' ? 'تم إضافة العنصر إلى المفضلة' : 'Item added to favorites',
        placement: currentLanguage === 'ar' ? 'topLeft' : 'topRight',
      });
    }
  };

  if (!product) return null;

  return (
    <>
      <div
        key={product.uuid}
        className="rounded-xl h-fit bg-white border-[0.9px] w-full animate-fadeInBottom hover:lg:scale-[1.02] transition-all duration-200 ease-in-out"
      >
        <Link href={`/${product.uuid}`}>
          <div className="w-full relative lg:h-[60%] md:h-[55%] h-[45%] flex justify-center items-center overflow-hidden">
            <Image
              className={`object-cover w-full h-48 md:h-56 lg:h-64 rounded-t-xl min-h-full transition-opacity duration-500 animate-fadeIn`}
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
              className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs"
              style={{
                color: textColor,
                backgroundColor: mainColor,
              }}
            >
              {product.collection || 'Unknown Collection'}
            </div>
          </div>
        </Link>
        <div className="w-full p-2 md:p-2 lg:p-3 flex flex-col justify-between leading-5 font-bold text-black">
          <Link href={`/${product.uuid}`} className="flex flex-col p-1 lg:p-0 h-full ">
            <span className="lg:text-lg md:text-md text-sm lg:line-clamp-3 line-clamp-2">
              {product.title || 'Untitled Product'}
            </span>
          </Link>

          <div className="flex justify-between items-center pt-4 md:pt-3">
            <Heart
              onClick={handleToggleFavorite}
              className={`w-6 md:w-7 cursor-pointer transition-colors duration-300 ${
                isProductFavorite ? 'text-red-600 fill-current' : 'text-gray-600'
              }`}
            />

            <span className="text-center text-lg md:text-xl">
              {product.price ? product.price.toLocaleString('en-US') : 'N/A'} {t('currency')}
            </span>

            <div className="group">
              {productInCart ? (
                <div
                  style={{ color: mainColor, borderColor: mainColor }}
                  className="md:w-10 w-9 md:h-10 h-9 rounded-full border-[1.2px] flex items-center justify-center cursor-not-allowed"
                >
                  <Check />
                </div>
              ) : (
                <button
                  style={{ color: mainColor, borderColor: mainColor }}
                  className="font-bold w-9 h-9 md:w-10 md:h-10 text-lg md:text-xl flex justify-center items-center rounded-full transition-all duration-400 ease-in-out"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
