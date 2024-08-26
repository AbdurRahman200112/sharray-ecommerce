import { useEffect, useRef, useState } from 'react';
import { Search as SearchIcon, X as CloseIcon, Frown as SadFace } from 'lucide-react';
import { useTranslation } from '@/localization';
import { BASE_URL } from '@/lib/Common';
import Card from '../Product/Card';
import OverlayLayout from '../Layout/OverlayLayout';

export const SearchModal = ({ isOpen, setIsOpen }) => {
  const { t, currentLanguage } = useTranslation();

  const modalRef = useRef();
  const fadeOutTimeout = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const closeModal = () => {
    setIsOpen(false);
    setSearchResults([]);
    setSearchQuery('');
    setError('');
  };

  const handleClickOutside = event => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      fadeOutTimeout.current = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 1000);
    }

    return () => clearTimeout(fadeOutTimeout.current);
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen && !modalRef.current) return null;

  const handleSearchChange = async event => {
    setSearchQuery(event.target.value);
    setSearchResults([]);
    setError('');
    if (event.target.value.length >= 3) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/public/items?page=1&keyword=${searchQuery}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('search res', data.data);
          if (data.data.items.length === 0) {
            setError(
              currentLanguage === 'ar' ? 'للاسف، المنتج غير متوفر' : 'Sorry, The product not exits'
            );
          } else {
            setError('');
            setSearchResults(data.data.items);
          }
        } else {
          console.error('API request failed:', response.statusText);
          setError('Error fetching data');
        }
      } catch (error) {
        console.error('API request error:', error);
        setError('Error fetching data');
      }
    }
  };

  return (
    <OverlayLayout>
      <div
        className={`fixed inset-0 flex justify-center items-start z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          }}
          className=" absolute inset-0"
        />

        <div
          className="p-4 rounded-lg relative flex flex-col items-center w-full max-w-7xl mx-auto overflow-y-auto h-full overflow-x-hidden"
          ref={modalRef}
        >
          <div className="flex items-center gap-4  mb-4 w-full mx-10 mt-8 ">
            <div className="flex flex-row-reverse items-center gap-4 flex-grow border-2 border-gray-300 bg-white h-14 px-5 rounded-full text-sm focus:outline-none lg:w-[80rem] placeholder:text-black">
              <input
                type="search"
                name="search"
                placeholder={`${
                  currentLanguage === 'ar' ? 'بحث عن منتجات...' : 'Search products...'
                }`}
                className="outline-none bg-transparent flex-grow text-black text-lg mt-1"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <SearchIcon className="text-gray-500 h-6 w-6" />
            </div>

            <button
              title="Close search"
              onClick={closeModal}
              className="ml-4 bg-red-700 hover:bg-red-600 text-white duration-300 transition-all font-semibold py-4 px-4 rounded-full"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Result */}
          <div className="flex items-center justify-center h-screen w-full">
            {searchResults.length === 0 ? (
              <p className="text-2xl animate-fade-in p-10 rounded-xl flex items-center gap-4 mb-44">
                {error && (
                  <p className="text-2xl animate-fade-in p-10 rounded-xl flex items-center gap-4 mb-44">
                    <SadFace className="w-8 h-8" />
                    <span className="mt-1">{error}</span>
                  </p>
                )}
              </p>
            ) : (
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-5 h-full w-full">
                {searchResults.map(el => (
                  <div className="animate-fade-up">
                    <Card product={el} key={el.uuid} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </OverlayLayout>
  );
};
