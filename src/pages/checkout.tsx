import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from '@/localization/index';
import { useSelector, useDispatch, connect } from 'react-redux';
import { Button, Form, Input, notification, Spin } from 'antd';
import { PushpinFilled } from '@ant-design/icons';

import ButtonWithValidation from '@/components/ButtonWithValidation';
import dynamic from 'next/dynamic'; // Dynamic import for the MapModal to ensure no SSR
import DefaultLayout from '@/components/Layout/DefaultLayout';

import { clearCart, selectCartTotal } from '@/redux/reducers/cartSlice';
import { fetchBusiness, selectBusiness } from '@/redux/reducers/businessSlice';
import { BASE_URL, ENV } from '@/lib/Common';
import { AppState, wrapper } from '@/redux/store';
import { validateDirection, validateLang } from '@/lib/Fuctions';

const { TextArea } = Input;

// Dynamically import the MapModal to avoid server-side rendering issues
const MapModal = dynamic(() => import('@/components/MapModal'), { ssr: false });

export const CheckOut = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation(); // Get current language and translation function
  const [form] = Form.useForm();

  const bs = useSelector(selectBusiness);
  const total = useSelector(selectCartTotal);

  const [isClient, setIsClient] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [isCheckingGeolocation, setIsCheckingGeolocation] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  // Run only on the client-side
  useEffect(() => {
    setIsClient(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setGeolocationEnabled(true);
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchAddressFromLocation(latitude, longitude);
      },
      () => {
        setGeolocationEnabled(false);
        notification.error({
          message: t('activateLocation'), // Changed for dynamic translation
          description: t('enableLocationInBrowser'), // Changed for dynamic translation
          placement: validateDirection(currentLanguage),
        });
      }
    );
  }, [currentLanguage]); // Ensure it reacts to language changes

  const fetchAddressFromLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const address = data.results[0].formatted_address;
        form.setFieldsValue({ addressInfo: address });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    localStorage.removeItem('cart');
  };

  const sendValidation = async (msg, encryptByAES, key) => {
    setIsSending(true);

    try {
      const values = await form.validateFields();
      setIsFormValid(true);

      const timestamp = Math.floor(new Date().getTime() / 1000);
      const updatedMsg = { ...msg, timeStamp: timestamp };
      const url = `${BASE_URL}/api/v1/public/validate`;
      const encryptedCheck = encryptByAES(JSON.stringify(updatedMsg), key);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ check: encryptedCheck }),
      });
      const responseData = await response.json();

      if (responseData.status === 'success') {
        const tokenEncrypt = encryptByAES(responseData.token, key);
        await sendCartDataToApi(tokenEncrypt);
      } else {
        notification.error({
          message: t('errorOccurred'), // Use dynamic translation for error messages
          description:
            ENV === 'DEV'
              ? responseData.message
              : t('networkError'), // Translation for dynamic network error messages
          placement: validateDirection(currentLanguage),
        });
        console.error('Validation failed!', responseData);
        setIsSending(false);
      }
    } catch (error) {
      if (error instanceof Error && form.isFieldTouched()) {
        setIsFormValid(false);
        console.log(error);
      } else {
        console.error(error);
        notification.error({
          message: t('errorOccurred'), // Translation for error occurred
          description: t('fillRequiredFields'), // Translation for required fields
          placement: validateDirection(currentLanguage),
        });
      }
      setIsSending(false);
    }
  };

  const sendCartDataToApi = async finalToken => {
    try {
      const endpoint = `${BASE_URL}/api/v1/public/checkout`;

      const itemsString = localStorage.getItem('cart');
      const storedItems = itemsString ? JSON.parse(itemsString) : [];

      const items = storedItems.map(item => ({
        item_uuid: item.item_uuid,
        quan: item.quan,
        notes: item.item_notes || '',
      }));

      const cartData = {
        token: finalToken,
        data: {
          fullname: form.getFieldValue('fullName'),
          phone1: form.getFieldValue('phoneInfo'),
          phone2: form.getFieldValue('phoneInfo2') ?? null,
          address: form.getFieldValue('addressInfo'),
          longitude: location?.lng || 0,
          latitude: location?.lat || 0,
          sm_link: 'facebook.com',
          notes: form.getFieldValue('deliveryNotes') || 'none',
          order_date: '',
          delivery_cost: 1.22,
          discount: 1000,
          items: items,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log('Successfully sent cart data:', data);

      localStorage.setItem('latestOrder', data.orderNumber);
      localStorage.setItem('cameFromCheckout', 'true');
      const ordersString = localStorage.getItem('orders');
      let orders = ordersString ? JSON.parse(ordersString) : [];

      const newOrder = {
        orderNumber: data.orderNumber,
        timestamp: new Date().getTime(),
      };
      orders.push(newOrder);

      localStorage.setItem('orders', JSON.stringify(orders));
      handleClearCart();
      setIsSending(false);
      router.push('/success');
    } catch (error) {
      console.error('Error sending cart data!', error);
      notification.error({
        message: t('errorOccurred'),
        description: t('networkError'),
        placement: validateDirection(currentLanguage),
      });
      setIsSending(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleConfirmLocation = selectedLocation => {
    setLocation(selectedLocation);
    fetchAddressFromLocation(selectedLocation.lat, selectedLocation.lng);
    handleCloseModal();
  };

  return (
    <DefaultLayout>
      <Head>
        <title>
          {currentLanguage === 'ar' ? `${bs.title_ar} - ${t('checkout')}` : `${bs.title_en} - ${t('checkout')}`}
        </title>
        <meta
          property="og:description"
          content={currentLanguage === 'ar' ? bs.descr_ar : bs.descr_en}
          key="title"
        />
      </Head>
      <div className="flex lg:flex-row flex-col gap-7 w-full relative">
        <Form
          layout="vertical"
          form={form}
          className="flex lg:flex-row flex-col gap-7 lg:w-[50%] w-full relative"
        >
          <div className="flex flex-col gap-4 w-full">
            <Form.Item
              key={currentLanguage}
              name="fullName"
              label={t('fullName')}
              rules={[
                {
                  required: true,
                  message: t('pleaseEnterFullName'),
                },
              ]}
            >
              <Input placeholder={t('fullName')} size="large" />
            </Form.Item>
            <Form.Item
              key={currentLanguage}
              name="phoneInfo"
              label={t('phoneInfo')}
              rules={[
                {
                  required: true,
                  pattern: /^((\+964)|0)(\d{10})$/,
                  message: t('pleaseEnterValidPhoneNumber'),
                },
              ]}
            >
              <Input placeholder={t('phoneInfo')} size="large" />
            </Form.Item>
            <Form.Item
              key={currentLanguage}
              name="phoneInfo2"
              label={t('phoneInfo2')}
              rules={[
                {
                  required: false,
                  pattern: /^((\+964)|0)(\d{10})$/,
                  message: t('pleaseEnterValidPhoneNumber'),
                },
              ]}
            >
              <Input placeholder={t('phoneInfo2')} size="large" />
            </Form.Item>
            <Form.Item name="addressInfo2" label={t('Address 1')}>
              <Input placeholder={t('Address 1')} />
            </Form.Item>
            <Form.Item name="addressInfo" label={t('Address 2')}>
              <Input
                placeholder={t('Address 2')}
                suffix={
                  <Button
                    onClick={handleOpenModal}
                    style={{ backgroundColor: '#028181', color: 'white' }}
                  >
                    {t('pinOnMap')}
                  </Button>
                }
              />
            </Form.Item>
            <Form.Item name="deliveryNotes" label={t('deliveryNotes')}>
              <TextArea rows={5} placeholder={t('deliveryNotesPlaceholder')} size="large" />
            </Form.Item>
            <Form.Item>
              <ButtonWithValidation
                htmlType="submit"
                mainColor={bs.mainColor}
                textColor={bs.textColor}
                onValidation={sendValidation}
                isSending={isSending}
                disabled={!isFormValid}
              >
                {t('checkout')}
              </ButtonWithValidation>
            </Form.Item>
          </div>
        </Form>
        <div className="lg:w-[50%] w-full h-full lg:h-screen">
          <div className="border-y-2 border-black py-4 flex flex-col gap-2">
            <span className="text-xl font-bold">{t('summary')}</span>
            <div className="flex w-full justify-between text-lg font-bold">
              <span>{t('itemTotal')}</span>
              {isClient && <span>{total.toLocaleString('en-US')} {t('currency')}</span>}
            </div>
            <div className="flex w-full justify-between text-lg font-bold">
              <span>{t('deliveryPrice')}</span>
              <span>{(5000).toLocaleString('en-US')} {t('currency')}</span>
            </div>
          </div>
          <div className="flex w-full py-4 justify-between text-lg font-bold">
            <span>{t('grandTotalAll')}</span>
            {isClient && <span>{(total + 5000).toLocaleString('en-US')} {t('currency')}</span>}
          </div>
        </div>
      </div>

      {location && (
        <MapModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onConfirm={handleConfirmLocation}
          initialPosition={location}
        />
      )}
    </DefaultLayout>
  );
};

/* --------------------------------- Server --------------------------------- */
export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  await store.dispatch(fetchBusiness());

  return {
    props: {
      business: store.getState().business,
    },
  };
});

const mapStateToProps = (state: AppState) => ({
  business: state.business,
});

export default connect(mapStateToProps)(CheckOut);
