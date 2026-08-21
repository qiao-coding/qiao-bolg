import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**'
      },
      {
        protocol: 'https',
        hostname: 'q1.qlogo.cn',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'q.qlogo.cn',
        port: '',
        pathname: '/**'
      }
    ]
  },
  serverExternalPackages: ['@prisma/client'],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs'],
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
