/* eslint-disable @next/next/no-img-element -- next/og ImageResponse uses Satori, not next/image */
import { ImageResponse } from "next/og";

import { getOwnerData } from "@/lib/server/owner";

import { ogImageSize, ogPalette, truncateForOg } from "./image-config";
import { loadImageForOg } from "./load-image-for-og";

export async function buildHomeOgImageResponse() {
  const ownerData = await getOwnerData();

  const ownerName = ownerData?.name || "";
  const brandTitle = ownerName ? `${ownerName}'s Portfolio` : "Portfolio";
  const subtitle = ownerData?.aboutMe
    ? truncateForOg(ownerData.aboutMe, 220)
    : "Full-stack web development";

  const avatarSrc = await loadImageForOg("/Avatar-lg.webp", {
    exactCover: { w: 360, h: 360 },
  });
  const initial = (ownerName || "P").slice(0, 1).toUpperCase();

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
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            letterSpacing: -1.5,
            lineHeight: 1.05,
          }}
        >
          {brandTitle}
        </div>
        <div
          style={{
            fontSize: 26,
            color: ogPalette.muted,
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: 420,
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        {avatarSrc ? (
          <img
            alt=""
            height={360}
            src={avatarSrc}
            style={{
              borderRadius: 28,
              border: `1px solid ${ogPalette.accent}`,
            }}
            width={360}
          />
        ) : (
          <div
            style={{
              display: "flex",
              width: 360,
              height: 360,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              background: ogPalette.accent,
              border: `1px solid ${ogPalette.accent}`,
              fontSize: 140,
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
