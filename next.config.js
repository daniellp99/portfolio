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
  reactCompiler: true,
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90, 92],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

module.exports = nextConfig;
