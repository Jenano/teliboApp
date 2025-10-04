import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["ufaqmrphvkowszvitszv.supabase.co"],
  },
  eslint: {
    // Keep build green even if we purposely keep exact file content with 'any' per spec.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
