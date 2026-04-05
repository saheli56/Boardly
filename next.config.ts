import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "10.41.241.137",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
