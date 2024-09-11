const withTM = require('next-transpile-modules')([
  '@ant-design/icons',
  '@ant-design/icons-svg',
  'rc-util',
  'rc-pagination',
  'rc-picker',       // Include rc-picker
  'antd',            // Ensure antd is transpiled
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
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
});

module.exports = nextConfig;
