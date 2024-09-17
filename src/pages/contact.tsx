import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from '@/localization/index';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Input, notification } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';

import DefaultLayout from '@/components/Layout/DefaultLayout';
import { BASE_URL } from '@/lib/Common';
import { selectBusiness, fetchBusiness } from '@/redux/reducers/businessSlice';
import { clearCart, selectCartTotal } from '@/redux/reducers/cartSlice';
import { AppState, wrapper } from '@/redux/store';

const { TextArea } = Input;

export const Contact = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();
  const [form] = Form.useForm();

  const bs = useSelector(selectBusiness);
  const total = useSelector(selectCartTotal);

  const [isClient, setIsClient] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendContactDataToApi = async () => {
    setIsSending(true);
    try {
      const values = form.getFieldsValue();
      const endpoint = 'https://cuisinar.sharray.io/api/v1/public/contact';
  
      const contactData = {
        name: values.name || '',
        phone: values.phone || '',
        email: values.email || '',
        message: values.message || ''
      };
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
        body: JSON.stringify(contactData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Response Error:', errorData);
        throw new Error(`Error ${response.status}: ${errorData.message || 'Network error'}`);
      }
  
      notification.success({
        message: t('messageSent'),
        description: t('messageSentDescription'),
        placement: 'topRight',
      });
  
      form.resetFields();
    } catch (error) {
      console.error('Send Contact Data Error:', error);
      notification.error({
        message: t('errorSendingMessage'),
        description: error.message || t('networkErrorDescription'),
        placement: 'topRight',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{t('contactUs')}</title>
        <meta property="og:description" content={t('contactDescription')} />
        <meta name="keywords" content={t('contactKeywords')} />
      </Head>

      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between bg-white shadow-lg rounded-lg p-6 gap-6">
          <div className="flex flex-col items-start p-6 lg:w-1/3 border-r border-gray-300">
            <div className="flex items-center mb-4">
              <EnvironmentOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{t('address')}</h2>
            </div>
            <p className="text-gray-500 mb-4">Sunbelt, MT21, Bendemeer 06</p>

            <div className="flex items-center mb-4">
              <PhoneOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{t('phone')}</h2>
            </div>
            <p className="text-gray-500 mb-4">+0096 8893 5321 <br />+0096 8435 6353</p>

            <div className="flex items-center mb-4">
              <MailOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{t('email')}</h2>
            </div>
            <p className="text-gray-500">codinglab@gmail.com <br />info.codinglab@gmail.com</p>
          </div>

          <div className="flex flex-col lg:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">{t('Send Message')}</h1>
            <Form layout="vertical" form={form} className="w-full" onFinish={sendContactDataToApi}>
              <div className="grid grid-cols-1 gap-6">
                <Form.Item
                  name="name"
                  label={t('Name')}
                >
                  <Input placeholder={t('name')} size="large" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={t('Phone')}
                >
                  <Input placeholder={t('phone')} size="large" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={t('Email')}
                >
                  <Input placeholder={t('email')} size="large" />
                </Form.Item>
                <Form.Item
                  name="message"
                  label={t('Message')}
                >
                  <TextArea rows={4} placeholder={t('message')} size="large" />
                </Form.Item>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Button
                    style={{backgroundColor:"#008181",borderRadius:'20px',padding:'20px'}}
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isSending}
                >
                  {t('send')}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

// Server-side rendering
export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req }) => {
  const isMobile = req.headers['user-agent'].includes('Mobile');
  if (isMobile) {
    return {
      redirect: {
        destination: '/mobile',
        permanent: false,
      },
    };
  }

  try {
    await store.dispatch(fetchBusiness());
  } catch (error) {
    console.error('Error fetching business data:', error);
  }

  return { props: {} };
});

export default Contact;
