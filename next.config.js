/**
 * @type {import('next').NextConfig}
 *
 * This configuration enables experimental app router and server actions.
 * We also allow images from YouTube's CDN so video thumbnails load properly.
 */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    domains: ['i.ytimg.com'],
  },
};

module.exports = nextConfig;
