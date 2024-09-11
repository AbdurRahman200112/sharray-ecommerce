import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Head from 'next/head';
import { notification } from 'antd';
import LoaderSpinner from '@/components/LoaderSpinner';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false); // Loader only for form submission
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Text content based on language
  const currentLanguage = 'en';
  const title = currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact Us';
  const description = currentLanguage === 'ar'
    ? 'نود سماع رأيك! يرجى ملء النموذج أدناه وسنعود إليك في أقرب وقت ممكن.'
    : 'We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.';

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = currentLanguage === 'ar' ? 'الاسم مطلوب.' : 'Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = currentLanguage === 'ar' ? 'البريد الإلكتروني صالح مطلوب.' : 'Valid email is required.';
    if (!formData.subject) newErrors.subject = currentLanguage === 'ar' ? 'الموضوع مطلوب.' : 'Subject is required.';
    if (!formData.message) newErrors.message = currentLanguage === 'ar' ? 'الرسالة مطلوبة.' : 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      notification.success({
        message: currentLanguage === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully.',
      });

      // Clear form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      notification.error({
        message: currentLanguage === 'ar' ? 'حدث خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ أثناء إرسال رسالتك.' : 'There was an error sending your message.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{title}</title>
        <meta property="og:description" content={description} />
        <meta name="keywords" content="contact, support, feedback" />
      </Head>

      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-center bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-start justify-center p-6 lg:w-1/3 border-r border-gray-300">
            {/* Address Section */}
            <div className="flex items-center mb-4">
              <EnvironmentOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{currentLanguage === 'ar' ? 'العنوان' : 'Address'}</h2>
            </div>
            <p className="text-gray-500 mb-4">Sunbelt, MT21, Bendemeer 06</p>

            {/* Phone Section */}
            <div className="flex items-center mb-4">
              <PhoneOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{currentLanguage === 'ar' ? 'الهاتف' : 'Phone'}</h2>
            </div>
            <p className="text-gray-500 mb-4">+0096 8893 5321 <br />+0096 8435 6353</p>

            {/* Email Section */}
            <div className="flex items-center mb-4">
              <MailOutlined style={{ color: '#008181', fontSize: '28px' }} />
              <h2 className="text-xl font-bold text-gray-700 ml-2">{currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h2>
            </div>
            <p className="text-gray-500">codinglab@gmail.com <br />info.codinglab@gmail.com</p>
          </div>

          <div className="flex flex-col lg:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">
              {currentLanguage === 'ar' ? 'ارسل لنا رسالة' : 'Send us a message'}
            </h1>
            <p className="text-gray-600 mb-6">
              {currentLanguage === 'ar'
                ? 'إذا كان لديك أي عمل من أجلي أو أي استفسارات ...'
                : 'If you have any work from me or any queries related to my tutorial, you can send me a message from here. It’s my pleasure to help you.'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={currentLanguage === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={currentLanguage === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={currentLanguage === 'ar' ? 'أدخل الموضوع' : 'Enter subject'}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.subject && <p className="text-red-600 text-sm">{errors.subject}</p>}

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={currentLanguage === 'ar' ? 'أدخل رسالتك' : 'Enter your message'}
                rows={4}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
              {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}

              <button
                type="submit"
                style={{ backgroundColor: '#008181', color: 'white' }}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}`}
              >
                {loading ? 'Sending...' : currentLanguage === 'ar' ? 'إرسال الآن' : 'Send Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ContactUs;
