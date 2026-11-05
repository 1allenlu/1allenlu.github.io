import type { NextConfig } from 'next';

// Static export: GitHub Pages serves the generated out/ folder as plain files.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
