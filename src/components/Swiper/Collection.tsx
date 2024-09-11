import { useTranslation } from '@/localization/index';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FreeMode, Mousewheel, Navigation } from 'swiper/modules';
import { Swiper } from 'swiper/react';

import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Collection = ({ children }) => {
  const { currentLanguage } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index
  const swiperRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle slide change event
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex); // Update active index
    if (swiper.activeIndex >= 3) {
      // Disable further swiping after 4 slides
      swiper.allowSlideNext = false; // Disable next swipe after the 4th slide
    } else {
      swiper.allowSlideNext = true; // Enable next swipe if less than 4 slides
    }

    if (swiper.activeIndex === 0) {
      swiper.allowSlidePrev = false; // Disable prev swipe at the first slide
    } else {
      swiper.allowSlidePrev = true; // Enable prev swipe if not at the first slide
    }
  };

  const nextButton = (
    <div className={`swiper-button-next ${activeIndex >= 3 ? 'disabled' : ''}`}>
      <ArrowRight className="text-gray-500" />
    </div>
  );

  const prevButton = (
    <div className={`swiper-button-prev ${activeIndex === 0 ? 'disabled' : ''}`}>
      <ArrowLeft className="text-gray-500" />
    </div>
  );

  return (
    <Swiper
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onSlideChange={handleSlideChange} // Trigger on slide change
      direction={'horizontal'}
      className="bg-transparent rounded-full"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      spaceBetween={5}
      freeMode={false}
      loop={false} // Disable loop
      allowSlideNext={true} // Initially allow next swipe
      allowSlidePrev={false} // Initially disable previous swipe
      noSwipingClass="swiper-no-swiping"
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
      slidesPerView={4} // Adjust based on layout
      slidesPerGroup={1} // Moves 1 slide at a time
      breakpoints={{
        375: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 5,
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