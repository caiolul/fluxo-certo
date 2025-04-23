/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Removido experimental.serverActions pois agora é padrão
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
