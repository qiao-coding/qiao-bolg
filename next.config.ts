import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**'
      }
    ]
  },
  serverExternalPackages: ['@prisma/client'],
  // 添加 LinguiJS 支持
  // experimental: {
  //   serverComponentsExternalPackages: ['@lingui/core', '@lingui/react'],
  // },
  // 确保能处理 .mjs 文件
  webpack: (config, { isServer }) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs'],
    };
    return config;
  },
};

export default nextConfig;
