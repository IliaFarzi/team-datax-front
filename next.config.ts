import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://62.60.198.4:8040/:path*",
      },
    ];
  },
};

export default nextConfig;
