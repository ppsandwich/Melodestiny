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
      resolveAlias: {
        // Dummy alias to tell Next.js that we explicitly acknowledge Turbopack.
        // This clears the "no turbopack config" error.
      }
    }
  }
};

export default nextConfig;
