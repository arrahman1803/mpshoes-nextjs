import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fra.cloud.appwrite.io',
        pathname: '/v1/storage/**',
      },
    ],
  }
};

export default nextConfig;
