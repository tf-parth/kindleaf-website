import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/account',
        destination: '/',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
