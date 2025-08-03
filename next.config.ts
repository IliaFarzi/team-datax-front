import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "julius.ai",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "r2.julius.ai",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
