/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-mdx-remote"],
  reactCompiler: true,
  cacheComponents: true,
};

module.exports = nextConfig;
