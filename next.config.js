/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }, // ✅ added
    ],
  },
  async rewrites() {
    // Dev proxy to backend API to avoid CORS and .env issues
    const hasApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    return hasApiUrl
      ? []
      : [{ source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' }];
  },
};

module.exports = nextConfig;
