/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.gr-assets.com",
      },
      {
        protocol: "https",
        hostname: "**.goodreads.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "**.media-amazon.com",
      },
    ],
  },
};

export default nextConfig;
