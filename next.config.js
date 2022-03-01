/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pages',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
