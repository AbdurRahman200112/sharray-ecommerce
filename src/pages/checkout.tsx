import ButtonWithValidation from '@/components/ButtonWithValidation';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import MapModal from '@/components/MapModal';
import { useTranslation } from '@/localization/index';
import { Button, Form, Input, notification } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { BASE_URL, ENV } from '@/lib/Common';
import { validateDirection, validateLang } from '@/lib/Fuctions';
import { fetchBusiness, selectBusiness } from '@/redux/reducers/businessSlice';
import { clearCart, selectCartTotal } from '@/redux/reducers/cartSlice';
import { AppState, wrapper } from '@/redux/store';

const { TextArea } = Input;

export const CheckOut = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();
  const [form] = Form.useForm();

  const businessState = useSelector(selectBusiness);
  const total = useSelector(selectCartTotal);

  const [isClient, setIsClient] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [isCheckingGeolocation, setIsCheckingGeolocation] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsClient(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocationEnabled(true);
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchAddressFromLocation(latitude, longitude);
      },
      () => {
        setGeolocationEnabled(false);
        notification.error({
          message: validateLang(currentLanguage) ? 'تفعيل سماحية الوصول للموقع' : 'Activate Location',
          description: validateLang(currentLanguage)
            ? 'يرجى تفعيل سماحية الوصول للموقع'
            : 'To use maps functionality, enable location in your browser',
          placement: validateDirection(currentLanguage),
        });
      }
    );
  }, [currentLanguage]);

  const handleClearCart = () => {
    dispatch(clearCart());
    localStorage.removeItem('cart');
  };

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

  const sendValidation = async (msg, encryptByAES, key) => {
    setIsSending(true);
    try {
      const values = await form.validateFields();
      setIsFormValid(true);

      const timestamp = Math.floor(Date.now() / 1000);
      const updatedMsg = { ...msg, timeStamp: timestamp };
      const encryptedCheck = encryptByAES(JSON.stringify(updatedMsg), key);
      const url = `${BASE_URL}/api/v1/public/validate`;

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
          message: validateLang(currentLanguage) ? 'يوجد خطأ ما' : 'There is an error',
          description: ENV === 'DEV' ? responseData.message : 'Network error. Please try again.',
          placement: validateDirection(currentLanguage),
        });
        setIsSending(false);
      }
    } catch (error) {
      notification.error({
        message: validateLang(currentLanguage) ? 'يوجد خطأ ما' : 'There is an error',
        description: 'Please fill in the required fields.',
        placement: validateDirection(currentLanguage),
      });
      setIsSending(false);
    }
  };

  const sendCartDataToApi = async (finalToken) => {
    try {
      const endpoint = `${BASE_URL}/api/v1/public/checkout`;
      const itemsString = localStorage.getItem('cart');
      const storedItems = itemsString ? JSON.parse(itemsString) : [];

      const cartData = {
        token: finalToken,
        data: {
          fullname: form.getFieldValue('fullName'),
          phone1: form.getFieldValue('phoneInfo'),
          phone2: form.getFieldValue('phoneInfo2') ?? null,
          address: form.getFieldValue('addressInfo'),
          longitude: location?.lng || 0,
          latitude: location?.lat || 0,
          notes: form.getFieldValue('deliveryNotes') || 'none',
          items: storedItems.map((item) => ({
            item_uuid: item.item_uuid,
            quan: item.quan,
            notes: item.item_notes || '',
          })),
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      handleClearCart();
      setIsSending(false);
      router.push('/success');
    } catch (error) {
      notification.error({
        message: 'Error sending cart data',
        description: 'Please check your connection and try again.',
        placement: 'topRight',
      });
      setIsSending(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleConfirmLocation = (selectedLocation) => {
    setLocation(selectedLocation);
    fetchAddressFromLocation(selectedLocation.lat, selectedLocation.lng);
    handleCloseModal();
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{`${businessState.title_en || 'Checkout'} - Checkout`}</title>
        <meta property="og:description" content={businessState.descr_en} key="description" />
      </Head>
      <div className="flex flex-col lg:flex-row gap-7 w-full relative">
        <Form layout="vertical" form={form} className="lg:w-[50%] w-full relative">
          <div className="flex flex-col gap-4 w-full">
            <Form.Item
              name="fullName"
              label={t('fullName')}
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input placeholder={t('fullName')} size="large" />
            </Form.Item>
            <Form.Item
              name="phoneInfo"
              label={t('phoneInfo')}
              rules={[{ required: true, pattern: /^((\+964)|0)(\d{10})$/, message: 'Please enter a valid phone number!' }]}
            >
              <Input placeholder={t('phoneInfo')} size="large" />
            </Form.Item>
            <Form.Item name="addressInfo" label={t('Address 1')}>
              <Input
                placeholder={t('addressInfo')}
                suffix={
                  <Button onClick={handleOpenModal} style={{ backgroundColor: '#028181', color: 'white' }}>
                    {t('Pin On Map')}
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
                mainColor={businessState.mainColor}
                textColor={businessState.textColor}
                onValidation={sendValidation}
                isSending={isSending}
              >
                {t('checkOut')}
              </ButtonWithValidation>
            </Form.Item>
          </div>
        </Form>
        <div className="lg:w-[50%] w-full h-full lg:h-screen">
          <div className="border-y-2 border-black py-4 flex flex-col gap-2">
            <span className="text-xl font-bold">{t('summary')}</span>
            <div className="flex justify-between text-lg font-bold">
              <span>{t('itemTotal')}</span>
              <span>{total.toLocaleString('en-US')} {t('currency')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>{t('deliveryPrice')}</span>
              <span>{(5000).toLocaleString('en-US')} {t('currency')}</span>
            </div>
          </div>
          <div className="flex justify-between py-4 text-lg font-bold">
            <span>{t('grandTotalAll')}</span>
            <span>{(total + 5000).toLocaleString('en-US')} {t('currency')}</span>
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

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
  await store.dispatch(fetchBusiness());
  return { props: { business: store.getState().business } };
});

export default connect((state: AppState) => ({ business: state.business }))(CheckOut);
