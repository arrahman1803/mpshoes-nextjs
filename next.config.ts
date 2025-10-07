import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
        pathname: '/v1/storage/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
