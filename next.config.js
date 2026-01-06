/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-mdx-remote"],
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: ["127.0.0.1"],
};

module.exports = nextConfig;
