/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_INTERNET_PROTOCOL || 'https',
        hostname: process.env.NEXT_PUBLIC_IMG_URI || 'api.sharray.io',
      },
    ],
  },
};

module.exports = nextConfig;
