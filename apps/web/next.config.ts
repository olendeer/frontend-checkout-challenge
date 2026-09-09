import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  reactStrictMode: true,
  transpilePackages: ['@checkout/contracts'],
};

export default nextConfig;
