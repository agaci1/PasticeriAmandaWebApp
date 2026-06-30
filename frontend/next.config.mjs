/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'striking-commitment-production.up.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.pasticeriamanda.com',
        pathname: '/uploads/**',
      },
    ],
  },
  transpilePackages: ['framer-motion'],
}

export default nextConfig
