/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'pbs.twimg.com',
      'sleepercdn.com',
      'a.espncdn.com',
    ],
  },
  env: {
    CUSTOM_KEY: 'PPR_FANTASY_FOOTBALL_EXPERT',
  },
}

module.exports = nextConfig 