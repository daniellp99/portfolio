/** @type {import('next').NextConfig} */
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_SITE_URL?.trim()
) {
  console.warn(
    "[portfolio] NEXT_PUBLIC_SITE_URL is not set. Set it to your canonical HTTPS URL for stable canonical tags and social previews.",
  );
}

const nextConfig = {
  transpilePackages: ["next-mdx-remote"],
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: ["127.0.0.1"],
};

module.exports = nextConfig;
