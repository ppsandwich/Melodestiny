import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  experimental: {
    turbo: {
      // Acknowledge Turbopack usage to clear the error.
      // Turbopack supports WASM out-of-the-box in Next 15.
    }
  }
};

export default nextConfig;
