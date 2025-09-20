/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'hi', 'ur', 'ks'],
    defaultLocale: 'en',
  },
};

module.exports = withPWA(nextConfig);