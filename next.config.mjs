/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  images: {
    domains: [], // Add any external image domains if needed
  },
};

export default nextConfig;
