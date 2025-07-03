/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Vercel - we want SSR capabilities
  // output: 'export', // Commented out for Vercel
  trailingSlash: true,
  images: {
    unoptimized: true // Keep this for now, can be optimized later on Vercel
  },
  // Remove GitHub Pages specific paths
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/andrews-travel-blog' : '',
  // basePath: process.env.NODE_ENV === 'production' ? '/andrews-travel-blog' : '',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
