import { useTranslation } from '../localization/index';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { selectProducts } from '@/redux/reducers/productSlice';

import 'swiper/swiper-bundle.css';
import Card from '@/components/Product/Card';

const Recommendation = () => {
  const { t } = useTranslation();
  const pr = useSelector(selectProducts);

  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 overflow-hidden">
      {pr.length ? (
        <Swiper
          spaceBetween={14}
          slidesPerView={2}
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
          {pr.map(product => (
            <SwiperSlide key={product.uuid} className="my-10">
              <Card product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <span className="text-center text-gray-500">{t('noProductLikeThis')}</span>
      )}
    </div>
  );
};

export default Recommendation;
