import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prefer standard Next server start on Railway (not Docker-only standalone path)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
