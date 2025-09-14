/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Allow cross-origin requests from network IPs during development
  allowedDevOrigins: ['172.31.96.1'],
  async headers() {
    return [];
  },
};

module.exports = nextConfig;
