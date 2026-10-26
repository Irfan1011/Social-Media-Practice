import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*.app.github.dev', 'localhost:3000']
    }
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/myImageLoader.ts",
  },
};

export default nextConfig;
