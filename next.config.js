const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://wrny.tocaan.net/api/:path*',
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'wrny.tocaan.net',
            },
        ],
    },
};
module.exports = withNextIntl(nextConfig);
