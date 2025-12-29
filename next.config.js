const { URL } = require('url');
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || '';
const cdnHostname = cdnUrl ? new URL(cdnUrl).hostname : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      ...(cdnHostname ? [{
        protocol: 'https',
        hostname: cdnHostname,
        pathname: '/images/**',
      }] : []),
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**', // allow all paths under this domain
      },
    ],
  },
};

module.exports = nextConfig;




// // //next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = nextConfig;