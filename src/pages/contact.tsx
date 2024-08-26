import { useState } from 'react';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Head from 'next/head';
import { notification } from 'antd';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sample data for title and description
  const title_ar = "اتصل بنا"; // Example Arabic title
  const title_en = "Contact Us"; // Example English title
  const descr_ar = "نود سماع رأيك! يرجى ملء النموذج أدناه وسنعود إليك في أقرب وقت ممكن."; // Example Arabic description
  const descr_en = "We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible."; // Example English description
  const currentLanguage = 'en'; // Default language, you can adjust as needed

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required.';
    if (!formData.subject) newErrors.subject = 'Subject is required.';
    if (!formData.message) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate form submission
      // Replace with actual API request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      notification.success({
        message: 'Success',
        description: 'Your message has been sent successfully.',
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'There was an error sending your message.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{currentLanguage === 'ar' ? title_ar : title_en}</title>
        <meta
          property="og:description"
          content={currentLanguage === 'ar' ? descr_ar : descr_en}
        />
        {/* Replace the following with your actual keywords */}
        <meta name="keywords" content="contact, support, feedback" />
      </Head>
      <div className="container mx-auto p-4 lg:p-8">
        <h1 className="text-2xl font-bold mb-4">{currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact Us'}</h1>
        <p className="mb-6">{currentLanguage === 'ar' ? 'نود سماع رأيك! يرجى ملء النموذج أدناه وسنعود إليك في أقرب وقت ممكن.' : 'We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.'}</p>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">{currentLanguage === 'ar' ? 'الموضوع' : 'Subject'}</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">{currentLanguage === 'ar' ? 'الرسالة' : 'Message'}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}`}
          >
            {loading ? 'Sending...' : (currentLanguage === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default ContactUs;
