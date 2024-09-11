import { Empty } from '@/components/favorites/Empty';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import LoaderSpinner from '@/components/LoaderSpinner';
import Card from '@/components/Product/Card';
import { useTranslation } from '@/localization';
import { clearFavorites, selectFavorites } from '@/redux/reducers/favoritesSlice';
import { Trash2 } from 'lucide-react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Favorites: NextPage = () => {
  const { t, currentLanguage } = useTranslation();
  const favorites = useSelector(selectFavorites);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(favorites.length === 0);

  useEffect(() => {
    if (favorites.length > 0) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [favorites]);

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{currentLanguage === 'ar' ? 'المفضلة' : 'Favorites'}</title>
        <meta
          property="og:description"
          content={currentLanguage === 'ar' ? 'صفحة المفضلة' : 'Favorites page'}
          key="description"
        />
      </Head>
      {loading ? (
        <LoaderSpinner />
      ) : (
        <div>
          {Array.isArray(favorites) && favorites.length === 0 ? (
            <Empty />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-10">
                <h1 className="text-2xl font-bold">{t('fav')}</h1>
                <button
                  aria-label="Clear Favorites"
                  className="flex items-center justify-center gap-3 text-sm font-light py-4 px-8 rounded-full transition-all ease-linear shadow-lg hover:opacity-80 bg-red-700 text-white"
                  onClick={handleClearFavorites}
                >
                  <Trash2 width={16} height={16} />
                  <span className="mt-1">{t('clearFav')}</span>
                </button>
              </div>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                {favorites.map((product) => (
                  <Card key={product.uuid} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Favorites;
