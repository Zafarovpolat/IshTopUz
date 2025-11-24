import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars
      },
      // ✅ ДОБАВЬТЕ ЭТО:
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // Pravatar avatars
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // UI Avatars (на всякий случай)
      },
    ],
  },
};

export default nextConfig;
