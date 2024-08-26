import Image from 'next/image';

import { useTranslation } from '@/localization/index';
import { Business } from '@/lib/Interfaces';
import { BASE_IMG } from '@/lib/Common';
import { Drawer as AntDrawer, ConfigProvider } from 'antd';
import type { DrawerProps } from 'antd/es/drawer';
import { Truck, Phone, X, ShoppingBag, Heart } from 'lucide-react';

import IconText from './IconText';
import LangSwitcher from './LangSwitcher';
import { useState } from 'react';

export default function Drawer({
  business,
  isOpen,
  setIsOpen,
}: {
  business: Business;
  isOpen: boolean;
  setIsOpen: any;
}) {
  const ph = '/placeholder-logo.svg'; // Path to Placeholder image
  const { t, currentLanguage } = useTranslation();
  const { mainColor, textColor, logo, title_ar, title_en } = business;
  const placement = currentLanguage === 'ar' ? 'right' : 'left';
  const [imageError, setImageError] = useState(false);
  const sections = [
    { link: '/cart', icon: ShoppingBag, text: 'cartHead' },
    { link: '/favorites', icon: Heart, text: 'fav' },
    { link: '/orders', icon: Truck, text: 'currentOrder' },
    { link: '/contact', icon: Phone, text: 'contactUs' },
  ];
  return (
    <ConfigProvider direction={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <AntDrawer
        placement={placement}
        onClose={() => setIsOpen(false)}
        open={isOpen}
        width={290}
        closable={false}
        style={{
          backgroundColor: mainColor,
        }}
        drawerStyle={{
          backgroundColor: mainColor,
        }}
      >
        <div className="flex flex-col justify-start  gap-10 h-full" style={{ color: textColor }}>
          <button
            title="close"
            onClick={() => setIsOpen(false)}
            className="w-full flex justify-end"
          >
            <X strokeWidth={1.5} size={18} />
          </button>
          <div className="w-full flex justify-center items-center">
            <Image
              src={imageError ? ph : `${BASE_IMG}/${logo}`}
              width={65}
              height={65}
              loading="lazy"
              placeholder="blur"
              blurDataURL={ph}
              alt={currentLanguage === 'ar' ? title_ar : title_en}
              onError={() => setImageError(true)}
              className="object-cover w-28 h-full rounded-lg"
            />
          </div>
          <div>
            {/* Sections */}
            {sections.map(el => (
              <IconText link={el.link} key={el.link} color={textColor}>
                <el.icon strokeWidth={1.5} size={18} />
                <span className="mt-1.5">{t(el.text)}</span>
              </IconText>
            ))}

            <div className="">
              <LangSwitcher textColor={textColor} />
            </div>
          </div>

          <div className="flex items-end justify-center mt-auto">
            <div
              className=" flex flex-col gap-2 justify-center items-center"
              style={{
                color: textColor,
              }}
            >
              <img className="w-7" src="/esite_logo.svg" alt="" />
              <span className="text-xs">eSITE Information Technology</span>
            </div>
          </div>
        </div>
      </AntDrawer>
    </ConfigProvider>
  );
}
