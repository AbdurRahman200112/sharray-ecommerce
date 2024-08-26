import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Navigation } from 'swiper/modules';
import { useTranslation } from '@/localization/index';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useEffect, useState } from 'react';

const Collection = ({ children }) => {
  const { currentLanguage } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextButton = (
    <div className="swiper-button-next">
      <ArrowRight className="text-gray-500" />
    </div>
  );

  const prevButton = (
    <div className="swiper-button-prev">
      <ArrowLeft className="text-gray-500" />
    </div>
  );
  return (
    <Swiper
      direction={'horizontal'}
      className="bg-transparent rounded-full "
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      spaceBetween={5}
      freeMode={false}
      noSwipingClass="swiper-no-swiping"
      loop={false}
      mousewheel={{
        forceToAxis: false,
        sensitivity: 1,
        releaseOnEdges: true,
      }}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
      modules={[FreeMode, Mousewheel, Navigation]}
      breakpoints={{
        375: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 7,
          spaceBetween: 20,
        },
      }}
    >
      {children}
      {nextButton}
      {prevButton}
    </Swiper>
  );
};

export default Collection;
