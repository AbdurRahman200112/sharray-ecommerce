import DefaultLayout from '@/components/Layout/DefaultLayout';
import Head from 'next/head';
import { wrapper } from '@/redux/store';
import { fetchBusiness, selectBusiness } from '@/redux/reducers/businessSlice';
import { Business } from '@/lib/Interfaces';
import { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFavorites, selectFavorites } from '@/redux/reducers/favoritesSlice';
import { Empty } from '@/components/favorites/Empty';
import { useTranslation } from '@/localization';
import { Trash2 } from 'lucide-react';
import Card from '@/components/Product/Card';

interface FavoritesProps {
  business: Business;
}

const Favorites: NextPage<FavoritesProps> = ({ business }) => {
  const { t, currentLanguage } = useTranslation();
  const fav = useSelector(selectFavorites);
  const bs = useSelector(selectBusiness);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <DefaultLayout>
      <Head>
        <title>
          {currentLanguage === 'ar'
            ? `${business.title_ar} - المفضلة`
            : `${business.title_en} - Favorites`}
        </title>
        <meta
          property="og:description"
          content={currentLanguage === 'ar' ? business.descr_ar : business.descr_en}
          key="description"
        />
      </Head>
      {isClient ? (
        <div>
          {fav.length === 0 ? (
            <Empty />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-10">
                <h1 className="text-2xl font-bold">{t('fav')}</h1>
                <button
                  className="flex items-center justify-center gap-3 text-sm font-light py-4 px-8 rounded-full transition-all ease-linear shadow-lg hover:opacity-80 bg-red-700 text-white"
                  onClick={() => dispatch(clearFavorites())}
                >
                  <Trash2 width={16} height={16} />
                  <span className="mt-1">{t('clearFav')}</span>
                </button>
              </div>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                {fav.map(Item => (
                  <Card key={Item.id} product={Item} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  store => async () => {
    await store.dispatch(fetchBusiness());

    return {
      props: {
        business: store.getState().business,
      },
    };
  }
);

export default Favorites;
