import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useState } from 'react';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Head from 'next/head';
import { Button, Form, Input, notification } from 'antd';
import LoaderSpinner from '@/components/LoaderSpinner';
import { BASE_URL } from '@/lib/Common';
import { useTranslation } from '@/localization';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';

const ContactUs = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();
  const [form] = Form.useForm();
  const businessState = useSelector(selectBusiness);
  const [isSending, setIsSending] = useState(false);

  const sendContactDataToApi = async () => {
    try {
      const values = await form.validateFields();

      const endpoint = `${BASE_URL}/api/v1/public/contact`;

      const contactData = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.message
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) throw new Error('Network error');

      notification.success({
        message: 'Message Sent',
        description: 'Your message has been successfully sent.',
        placement: 'topRight',
      });

      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Error sending message',
        description: 'Please check your connection and try again.',
        placement: 'topRight',
      });
      setIsSending(false);
    }
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Contact Us</title>
        <meta property="og:description" content="Contact us for support or inquiries." />
        <meta name="keywords" content="contact, support, feedback" />
      </Head>

      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between bg-white shadow-lg rounded-lg p-6 gap-6">
          {/* Address Section */}
          <div className="flex flex-col items-start p-6 lg:w-1/3 border-r border-gray-300">
            <div className="flex items-center mb-4">
              <EnvironmentOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{currentLanguage === 'ar' ? 'العنوان' : 'Address'}</h2>
            </div>
            <p className="text-gray-500 mb-4">Sunbelt, MT21, Bendemeer 06</p>

            <div className="flex items-center mb-4">
              <PhoneOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{currentLanguage === 'ar' ? 'الهاتف' : 'Phone'}</h2>
            </div>
            <p className="text-gray-500 mb-4">+0096 8893 5321 <br />+0096 8435 6353</p>

            <div className="flex items-center mb-4">
              <MailOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h2>
            </div>
            <p className="text-gray-500">codinglab@gmail.com <br />info.codinglab@gmail.com</p>
          </div>

          {/* Form Section */}
          <div className="flex flex-col lg:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">
              {currentLanguage === 'ar' ? 'ارسل لنا رسالة' : 'Send us a message'}
            </h1>
            <p className="text-gray-600 mb-6">
              {currentLanguage === 'ar'
                ? 'إذا كان لديك أي عمل من أجلي أو أي استفسارات ...'
                : 'If you have any work or queries, feel free to send a message. It’s my pleasure to help you.'}
            </p>

            <Form layout="vertical" form={form} className="w-full" onFinish={sendContactDataToApi}>
              <div className="grid grid-cols-1 gap-6">
                <Form.Item
                  name="name"
                  label={t('name')}
                  rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                  <Input placeholder={t('name')} size="large" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={t('phone')}
                  rules={[{ required: true, pattern: /^(\+?\d{1,3})?\d{10}$/, message: 'Please enter a valid phone number!' }]}
                >
                  <Input placeholder={t('phone')} size="large" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={t('email')}
                  rules={[{ required: true, type: 'email', message: 'Please enter a valid email address!' }]}
                >
                  <Input placeholder={t('email')} size="large" />
                </Form.Item>
                <Form.Item name="message" label={t('message')}>
                  <TextArea rows={5} placeholder={t('message')} size="large" />
                </Form.Item>
                <Form.Item>
                  <Button style={{backgroundColor:'#008181',padding:'20px',borderRadius:'20px'}} type="primary" htmlType="submit" loading={isSending}>
                    {t('send')}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ContactUs;
