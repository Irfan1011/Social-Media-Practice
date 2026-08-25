import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/myImageLoader.ts",
  },
};

export default nextConfig;
