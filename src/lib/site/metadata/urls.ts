import { OWNER_AVATAR_PATH } from "@/content/owner-assets";

export function getOwnerAvatarPath(): string {
  return OWNER_AVATAR_PATH;
}

function getBaseUrl(): string {
  return getMetadataBase().origin;
}

export function getAbsoluteImageUrl(imagePath: string): string {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
}

export function getCanonicalUrl(path: string = ""): string {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function getHomeOgImageUrl(journeyStartAt?: string | null): string {
  const version = journeyStartAt?.slice(0, 10) ?? "default";
  return getAbsoluteImageUrl(
    `/opengraph-image?v=${encodeURIComponent(version)}`,
  );
}

export function getProjectOgImageUrl(slug: string): string {
  return getAbsoluteImageUrl(`/project/${slug}/opengraph-image`);
}

export function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL);
    } catch {}
  }

  if (process.env.VERCEL_URL) {
    try {
      return new URL(`https://${process.env.VERCEL_URL}`);
    } catch {}
  }

  const port = process.env.PORT || "3000";
  try {
    return new URL(`http://localhost:${port}`);
  } catch {
    return new URL("http://localhost:3000");
  }
}
