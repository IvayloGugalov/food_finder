/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgproxy-retcat.assets.schwarz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdncloudcart.com',
        port: '',
        pathname: '/16398/products/images/**',
      },
      {
        protocol: 'https',
        hostname: 'kaufland.media.schwarz',
        port: '',
        pathname: '/is/image/schwarz/**',
      },
    ],
  },
}

export default nextConfig
