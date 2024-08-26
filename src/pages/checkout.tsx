import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from '@/localization/index';
import { useSelector, useDispatch, connect } from 'react-redux';
import { Button, Form, Input, notification, Spin } from 'antd';
import { PushpinFilled } from '@ant-design/icons';
import ButtonWithValidation from '@/components/ButtonWithValidation';
import MapModal from '@/components/MapModal';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { clearCart, selectCartTotal } from '@/redux/reducers/cartSlice';
import { fetchBusiness, selectBusiness } from '@/redux/reducers/businessSlice';
import { BASE_URL, ENV } from '@/lib/Common';
import { AppState, wrapper } from '@/redux/store';
import { validateDirection, validateLang } from '@/lib/Fuctions';

const { TextArea } = Input;

export const CheckOut = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();
  const [form] = Form.useForm();

  const bs = useSelector(selectBusiness);
  const total = useSelector(selectCartTotal);

  const [isClient, setIsClient] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [isCheckingGeolocation, setIsCheckingGeolocation] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsCheckingGeolocation(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        setGeolocationEnabled(true);
        setIsCheckingGeolocation(false);
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchAddressFromLocation(latitude, longitude);
      },
      () => {
        setGeolocationEnabled(false);
        setIsCheckingGeolocation(false);
        notification.error({
          message: validateLang(currentLanguage)
            ? 'تفعيل سماحية الوصول للموقع'
            : 'Activate Location',
          description: validateLang(currentLanguage)
            ? 'يرجى تفعيل سماحية الوصول للموقع'
            : 'To use maps functionality you need to enable location in your browser',
          placement: validateDirection(currentLanguage),
        });
      }
    );
  }, []);

  const fetchAddressFromLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`);
      const data = await response.json();
      if (data.results.length > 0) {
        const address = data.results[0].formatted_address;
        form.setFieldsValue({ addressInfo: address });
      }
    } catch (error) {
      console.error('Error fetching address from location:', error);
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
          message: validateLang(currentLanguage) ? 'يوجد خطأ ما' : 'There an error',
          description: validateLang(currentLanguage)
            ? 'يرجى التحقق من الاتصال بخدمة الانترنيت الخاصة بك'
            : ENV === 'DEV'
            ? responseData.message
            : 'The request took too long. Please check your network connection and try again.',
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
          message: validateLang(currentLanguage) ? 'يوجد خطأ ما' : 'There an error',
          description: validateLang(currentLanguage)
            ? 'يرجى ملئ الحقول المطلوبة'
            : 'Please fill all the required fields',
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
          longitude: location.lng,
          latitude: location.lat,
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
        message: validateLang(currentLanguage) ? 'يوجد خطأ ما' : 'There an error',
        description: validateLang(currentLanguage)
          ? 'يرجى التحقق من الاتصال بخدمة الانترنيت الخاصة بك'
          : ENV === 'DEV'
          ? error.message
          : 'The request took too long. Please check your network connection and try again.',
        placement: validateDirection(currentLanguage),
      });
      setIsSending(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleConfirmLocation = location => {
    setLocation(location);
    handleCloseModal();
  };

  return (
    <DefaultLayout>
      <Head>
        <title>
          {currentLanguage === 'ar' ? `${bs.title_ar} - الدفع` : `${bs.title_en} - Checkout`}
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
          className="flex lg:flex-row flex-col gap-7 w-full relative"
          onFinish={values => {
            if (isFormValid) {
              sendValidation({ ...values }, encryptByAES, key);
            }
          }}
        >
          <div className="w-full flex flex-col lg:gap-4 gap-3 items-start">
            <h2 className="text-2xl font-bold">{t('checkout')}</h2>
            <div className="w-full lg:w-[500px]">
              <Form.Item
                name="fullName"
                label={t('full_name')}
                rules={[{ required: true, message: t('full_name_required') }]}
              >
                <Input placeholder={t('enter_full_name')} />
              </Form.Item>
              <Form.Item
                name="phoneInfo"
                label={t('phone_number')}
                rules={[{ required: true, message: t('phone_number_required') }]}
              >
                <Input placeholder={t('enter_phone_number')} />
              </Form.Item>
              <Form.Item name="phoneInfo2" label={t('phone_number_optional')}>
                <Input placeholder={t('enter_optional_phone_number')} />
              </Form.Item>
              <Form.Item
                name="addressInfo"
                label={t('address')}
                rules={[{ required: true, message: t('address_required') }]}
              >
                <TextArea
                  placeholder={t('enter_address')}
                  rows={3}
                  disabled={isCheckingGeolocation || isSending}
                />
              </Form.Item>
              <Form.Item name="deliveryNotes" label={t('delivery_notes')}>
                <TextArea placeholder={t('optional_delivery_notes')} rows={3} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleOpenModal}
                  disabled={isCheckingGeolocation || isSending}
                >
                  {t('select_on_map')}
                </Button>
              </Form.Item>
            </div>
          </div>
          <div className="w-full lg:w-[300px]">
            <div className="p-5 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-bold">{t('order_summary')}</h3>
              <p>{t('total')}: {total} {t('currency')}</p>
              <ButtonWithValidation
                type="primary"
                htmlType="submit"
                loading={isSending}
                disabled={isSending || isCheckingGeolocation}
              >
                {t('place_order')}
              </ButtonWithValidation>
            </div>
          </div>
        </Form>
        <MapModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmLocation}
          currentLocation={location}
        />
        {isCheckingGeolocation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spin />
            <p className="ml-2">{t('checking_location')}</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CheckOut;
