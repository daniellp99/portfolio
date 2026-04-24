/* eslint-disable @next/next/no-img-element -- next/og ImageResponse uses Satori, not next/image */
import { ImageResponse } from "next/og";

import {
  getOwnerDataDTO,
  getProjectDetailsDTO,
} from "@/lib/server/project-dto";

import { ogImageSize, ogPalette, truncateForOg } from "./image-config";
import { loadImageForOg } from "./load-image-for-og";

export async function buildProjectOgImageResponse(slug: string) {
  const [project, ownerData] = await Promise.all([
    getProjectDetailsDTO(slug),
    getOwnerDataDTO(),
  ]);

  const ownerName = ownerData?.name || "";
  const siteLabel = ownerName ? `${ownerName}'s Portfolio` : "Portfolio";

  const coverPath = project.coverImage.startsWith("/")
    ? project.coverImage
    : `/${project.coverImage}`;
  const coverSrc = await loadImageForOg(coverPath, {
    exactCover: { w: 440, h: 520 },
  });
  const initial = project.name.slice(0, 1).toUpperCase();

  const description = truncateForOg(project.description, 200);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        background: ogPalette.bg,
        color: ogPalette.fg,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: 56,
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: ogPalette.muted,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {siteLabel}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: -1.2,
            lineHeight: 1.05,
          }}
        >
          {project.name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: ogPalette.muted,
            lineHeight: 1.35,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: 520,
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        {coverSrc ? (
          <img
            alt=""
            height={520}
            src={coverSrc}
            style={{
              borderRadius: 20,
              border: `1px solid ${ogPalette.accent}`,
            }}
            width={440}
          />
        ) : (
          <div
            style={{
              display: "flex",
              width: 440,
              height: 520,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              background: ogPalette.accent,
              border: `1px solid ${ogPalette.accent}`,
              fontSize: 120,
              fontWeight: 700,
              color: ogPalette.muted,
            }}
          >
            {initial}
          </div>
        )}
      </div>
    </div>,
    {
      ...ogImageSize,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
