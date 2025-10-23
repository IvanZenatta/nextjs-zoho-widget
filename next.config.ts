import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'bubaline-unreaped-collen.ngrok-free.dev'],
  output: 'export',
  images: {unoptimized:true},
  trailingSlash:true,
  assetPrefix:'./'
};

export default nextConfig;
