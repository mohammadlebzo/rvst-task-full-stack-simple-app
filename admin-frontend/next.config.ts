import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    forceSwcTransforms: false,
  },
  output: 'standalone',
};

export default nextConfig;
