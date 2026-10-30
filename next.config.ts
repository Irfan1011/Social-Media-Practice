import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    serverActions: {
      allowedOrigins: ['https://paranormal-seance-xqx9499jj4935gj-3000.app.github.dev', 'localhost:3000']
    }
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/myImageLoader.ts",
  },
};

export default nextConfig;
