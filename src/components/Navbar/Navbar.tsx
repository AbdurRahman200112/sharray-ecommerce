import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BASE_IMG } from '@/lib/Common';
import { useTranslation } from '@/localization/index';
import { Search, Menu, ShoppingBag } from 'lucide-react';
import NavBtn from './NavBtn';
import Drawer from './Drawer';
import { useSelector } from 'react-redux';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { SearchModal } from './SearchModal';
import { selectTotalItemCount } from '@/redux/reducers/cartSlice';

export default function Navbar() {
  const ph = '/placeholder-logo.svg';
  const { t, currentLanguage } = useTranslation();
  const bs = useSelector(selectBusiness);
  const itemsLength = useSelector(selectTotalItemCount);
  const [imageError, setImageError] = useState(false);
  const { mainColor, textColor, title_ar, title_en, logo } = bs;

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handles opening and closing the drawer
  const handleDrawerClick = () => {
    setIsOpen(prevValue => !prevValue);
  };

  // Handles search modal visibility
  const handleSearchClick = () => {
    setIsModalOpen(true);
  };

  // Capitalizes the first letter of the string
  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // Sets the isClient state to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav
      className="flex justify-between items-center w-full py-5 lg:px-10 px-3 sticky top-0 z-10 shadow-lg"
      style={{ background: mainColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <Link href={'/'} className="flex items-center justify-center gap-2">
          <Image
            className="rounded-lg animate-fade-in"
            src={imageError ? ph : `${BASE_IMG}/${logo}`}
            width={65}
            height={65}
            placeholder="blur"
            blurDataURL={ph}
            onError={() => setImageError(true)}
            alt={currentLanguage === 'ar' ? title_ar : title_en}
          />
          <div>
            <h1 className="text-md lg:text-xl font-semibold">
              {currentLanguage === 'ar' ? bs.title_ar : capitalizeFirst(bs.title_en)}
            </h1>
            <p className="hidden lg:flex">{currentLanguage === 'ar' ? bs.descr_ar : bs.descr_en}</p>
          </div>
        </Link>

        {/* Buttons Section */}
        <div className="flex items-center ml-2 lg:gap-5 gap-0" style={{ color: textColor }}>
          <div className="flex items-center gap-5">
            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              title="search"
              className="border-2 border-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <Search strokeWidth={1.5} size={18} />
            </button>

            {/* Cart Button with Item Count */}
            <Link href={'/cart'} className="relative">
              <NavBtn>
                <ShoppingBag strokeWidth={1.5} size={18} />
                {isClient && itemsLength > 0 && (
                  <p className="absolute -top-3 right-0 bg-red-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="mt-1 text-sm">{itemsLength}</span>
                  </p>
                )}
              </NavBtn>
            </Link>

            {/* Drawer Button */}
            <NavBtn func={handleDrawerClick}>
              <Menu strokeWidth={1.5} size={18} />
            </NavBtn>
            <Drawer business={bs} isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
        {/* End of Buttons Section */}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </nav>
  );
}
