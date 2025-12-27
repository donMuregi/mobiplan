import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        // Production API domain - update this with your actual domain
        protocol: 'https',
        hostname: '*.mobiplan.co.ke',
      },
      {
        protocol: 'https',
        hostname: 'mobiplan.co.ke',
      },
    ],
  },
};

export default nextConfig;
