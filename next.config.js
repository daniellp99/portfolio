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
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  experimental: {
    cachedNavigations: "allow-runtime",
    viewTransition: true,
    optimizePackageImports: [
      "motion",
      "lucide-react",
      "date-fns",
      "react-grid-layout",
      "react-leaflet",
      "leaflet",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90, 92],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 144, 192, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Map marker avatars are static imports under `/public` (no entry needed)
    // or absolute URLs — allow common avatar/CDN hosts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "private-avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "c.basemaps.cartocdn.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
