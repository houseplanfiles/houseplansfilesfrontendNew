/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["framer-motion"],

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'houseplansfiles-backend.vercel.app', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      // FIX: Added S3 hostname so next/image can optimize S3 images
      { protocol: 'https', hostname: 'houseplanfiles1.s3.eu-north-1.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.s3.*.amazonaws.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    // FIX: Increased from 60s to 1 year for static product images
    minimumCacheTTL: 31536000,
    // FIX: Limit device sizes to reduce redundant image variants
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 128, 256, 384],
  },

  async redirects() {
    return [
      { source: '/product/:slug', destination: '/house-plans/:slug', permanent: true },
      { source: '/professional-plan/:slug', destination: '/house-plans/:slug', permanent: true },
      { source: '/category/:name', destination: '/house-plans/category/:name', permanent: true },
      { source: '/plans/:region', destination: '/house-plans/region/:region', permanent: true },
      { source: '/products', destination: '/house-plans', permanent: true },
      { source: '/house-plans-in-:city', destination: '/city/:city', permanent: true },
      { source: '/architects-in-:city', destination: '/city/:city', permanent: true },
      { source: '/contractors-in-:city', destination: '/city/:city', permanent: true },
      { source: '/:plotSize-house-plan', destination: '/house-plans/plot/:plotSize', permanent: true },
      { source: '/:plotSize-house-plans', destination: '/house-plans/plot/:plotSize', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/3d-plans',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      // FIX: Long cache for static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // FIX: Long cache for public images/fonts
      {
        source: '/(.*\\.(?:png|jpg|jpeg|webp|avif|ico|svg|woff|woff2))',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  eslint: { ignoreDuringBuilds: true },
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
