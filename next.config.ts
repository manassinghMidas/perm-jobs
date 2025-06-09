import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Add this line to ignore ESLint errors during Vercel build
  },
};

export default nextConfig;