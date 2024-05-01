/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kaufland.media.schwarz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'webassets.kaufland.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
