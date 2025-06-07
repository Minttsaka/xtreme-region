import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images:{
        domains:['images.unsplash.com','assets.aceternity.com','dct4life-files.s3.af-south-1.amazonaws.com']
    },
};

export default nextConfig;
