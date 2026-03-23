import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:"standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;