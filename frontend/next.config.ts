import type { NextConfig } from "next";
import path from "path";

// Prefer __dirname-style path for Next config reliability on Railway
const appRoot = process.cwd();

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: path.join(appRoot),
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**.up.railway.app" },
      { protocol: "https", hostname: "**.railway.app" },
    ],
  },
};

export default nextConfig;
