export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true
  },
  images: {
    loader: 'custom',
    loaderFile: 'image-loader.js',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'vercel-commerce.demo.vendure.io'
      }
    ]
  }
};
